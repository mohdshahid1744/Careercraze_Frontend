import React, { createContext, useCallback, useContext, useState, useRef, useEffect } from 'react';
import socket from '../utils/Socket/Soket';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/Store/Store';

interface WebRTCContextProps {
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    inCall: boolean;
    startCall: (userId: string) => void;
    acceptCall: (userId: string, from: string, offer: RTCSessionDescriptionInit) => void;
    endCall: () => void;
    peerConnection: RTCPeerConnection | null; 
}

const WebRTCContext = createContext<WebRTCContextProps | undefined>(undefined);

export const WebRTCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [inCall, setInCall] = useState(false);
    const [guestId, setGuestId] = useState('');
    const username = useSelector((store: RootState) => store.user.userEmail);
    const currentUser = useSelector((store: RootState) => store.user.UserId);
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const ringtoneRef = useRef<HTMLAudioElement | null>(null);

    const playRingtone = () => {
        if (ringtoneRef.current) {
            ringtoneRef.current.play().catch((error) => {
                console.error("Error playing ringtone:", error);
            });
        }
    };

    const stopRingtone = () => {
        if (ringtoneRef.current) {
            ringtoneRef.current.pause();
            ringtoneRef.current.currentTime = 0;
        }
    };

    const setupPeerConnection = useCallback((userId: string, fromId: string) => {
        if (!peerConnection.current) {
            peerConnection.current = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: [
                            "stun:stun.l.google.com:19302",
                            "stun:global.stun.twilio.com:3478",
                        ],
                    },
                ],
            });

            // Handle ontrack event
            peerConnection.current.ontrack = (event) => {
                if (event.streams && event.streams[0]) {
                    console.log('Received remote stream:', event.streams[0]);
                    setRemoteStream(event.streams[0]);
                }
            };

            // Handle onicecandidate event
            peerConnection.current.onicecandidate = (event) => {
                if (event.candidate) {
                    console.log('Sending ICE candidate:', event.candidate);
                    socket.emit('signal', { userId: fromId, type: 'candidate', candidate: event.candidate, context: 'webRTC' });
                }
            };
        }
    }, []);

    const startCall = async (userId: string) => {
        setGuestId(userId);
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        setLocalStream(stream);
        if (!currentUser) {
            console.error("Current user is not defined");
            return;
        }
        setupPeerConnection(userId, currentUser);

        if (peerConnection.current) {
            for (const track of stream.getTracks()) {
                peerConnection.current.addTrack(track, stream);
            }

            const offer = await peerConnection.current.createOffer();
            await peerConnection.current.setLocalDescription(offer);

            socket.emit('callUser', { userToCall: userId, from: username, offer, fromId: currentUser });
            setInCall(true);
        }
    };

    const acceptCall = async (userId: string, fromId: string, offer: RTCSessionDescriptionInit) => {
        setGuestId(userId);
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);

        setupPeerConnection(userId, fromId);

        if (peerConnection.current) {
            for (const track of stream.getTracks()) {
                peerConnection.current.addTrack(track, stream);
            }

            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
            console.log('Remote description set:', offer);

            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);

            socket.emit('callAccepted', { userId: fromId, answer, context: 'webRTC' });
            setInCall(true);
            stopRingtone();
        }
    };

    const endCall = () => {
        if (peerConnection.current) {
            peerConnection.current.close();
            peerConnection.current = null;
        }

        if (localStream) {
            localStream.getTracks().forEach((track) => track.stop());
            setLocalStream(null);
        }

        if (remoteStream) {
            remoteStream.getTracks().forEach((track) => track.stop());
            setRemoteStream(null);
        }

        socket.emit("callEnded", guestId);
        setInCall(false);
        stopRingtone();
    };

    useEffect(() => {
        socket.on('signal', async (data) => {
            const { type, candidate, answer } = data;
            console.log('Received signal:', type, candidate, answer);

            if (peerConnection.current) {
                try {
                    if (type === 'answer' && peerConnection.current.signalingState === 'have-local-offer') {
                        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
                    } else if (type === 'candidate' && peerConnection.current.signalingState !== 'closed') {
                        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
                    }
                } catch (error) {
                    console.error('Error handling signal:', error);
                }
            }
        });

        socket.on('callAcceptedSignal', async (data) => {
            const { answer } = data;
            console.log('Received callAcceptedSignal:', answer);

            if (peerConnection.current) {
                try {
                    if (peerConnection.current.signalingState === 'have-local-offer') {
                        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
                    }
                } catch (error) {
                    console.error('Error handling callAcceptedSignal:', error);
                }
            }
        });

        socket.on('callEndedSignal', () => {
            console.log('Came to end call');
            endCall();
        });

        return () => {
            socket.off('signal');
            socket.off('callEndedSignal');
            socket.off('callAcceptedSignal');
        };
    }, [setupPeerConnection]);

    const contextValue: WebRTCContextProps = {
        localStream,
        remoteStream,
        inCall,
        startCall,
        acceptCall,
        endCall,
        peerConnection: peerConnection.current,
    };

    return (
        <WebRTCContext.Provider value={contextValue}>
            {children}
            <audio ref={ringtoneRef} src="/ringtone.mp3" loop />
        </WebRTCContext.Provider>
    );
};

export const useWebRTC = (): WebRTCContextProps => {
    const context = useContext(WebRTCContext);
    if (!context) {
        throw new Error('useWebRTC must be used within a WebRTCProvider');
    }
    return context;
};
