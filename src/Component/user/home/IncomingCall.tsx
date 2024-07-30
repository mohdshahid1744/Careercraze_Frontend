import React, { useEffect, useState } from 'react';
import { useWebRTC } from '../../../Context/WebrtcContext';
import socket from '../../../utils/Socket/Soket';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Redux/Store/Store';

interface IncomingCallNotificationProps {
    callerId: string;
    callerName: string;
    onAccept: () => void;
    onReject: () => void;
}

const IncomingCallNotification: React.FC<IncomingCallNotificationProps> = ({ callerName, onAccept, onReject }) => {
    return (
        <div className="fixed bottom-0 right-0 m-4 p-4 bg-gradient-to-r from-blue-500 to-purple-600 shadow-2xl rounded-xl flex items-center space-x-4 text-white">
        <div className="flex-1">
            <h4 className="font-bold text-lg">{callerName}</h4>
            <p className="text-sm">Incoming video call...</p>
        </div>
        <button 
            onClick={onAccept} 
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600"
        >
            Accept
        </button>
        <button 
            onClick={onReject} 
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
        >
            Reject
        </button>
    </div>
    );
};


const GlobalIncomingCallHandler: React.FC = () => {
    const { acceptCall, endCall } = useWebRTC();
    const [incomingCall, setIncomingCall] = useState<{
        fromId: string; from: string, offer: RTCSessionDescriptionInit
    } | null>(null);
    const userId = useSelector((store: RootState) => store.user.UserId) || '';

    useEffect(() => {
        socket.on('incomingCall', (data: { from: string, offer: RTCSessionDescriptionInit, fromId: string }) => {
            console.log('incoming call', data);
            setIncomingCall(data);
        });

        return () => {
            socket.off('incomingCall');
        };
    }, []);

    const handleAccept = () => {
        if (incomingCall) {
            acceptCall(userId, incomingCall.fromId, incomingCall.offer);
            setIncomingCall(null);
        }
    };

    const handleReject = () => {
        endCall();
        setIncomingCall(null);
    };

    if (!incomingCall) return null;

    return (
        <IncomingCallNotification
            callerId={incomingCall.from}
            callerName={incomingCall.from}
            onAccept={handleAccept}
            onReject={handleReject}
        />
    );
};

export default GlobalIncomingCallHandler;
