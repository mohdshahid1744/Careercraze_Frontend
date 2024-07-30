import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserRoutes from './Route/UserRouter';
import RecruiterRoute from './Route/RecruiterRoute';
import AdminRouter from './Route/AdminRouter';
import ChatProvider from './Context/ChatProvider'; 
import { WebRTCProvider, useWebRTC } from './Context/WebrtcContext';
import VideoCallModal from './Component/user/home/Videocall';
import GlobalIncomingCallHandler from './Component/user/home/IncomingCall';

function App() {
  return (
    <WebRTCProvider>
      <div className="App">
        <Router>
          <ChatProvider>
            <Routes>
              <Route path='/*' element={<UserRoutes />} />
              <Route path='/recruiter/*' element={<RecruiterRoute />} />
              <Route path='/admin/*' element={<AdminRouter />} />
            </Routes>
          </ChatProvider>
        </Router>
        <GlobalVideoCallHandler />
        <GlobalIncomingCallHandler />
      </div>
    </WebRTCProvider>
  );
}

const GlobalVideoCallHandler: React.FC = () => {
  const { localStream, remoteStream, inCall, endCall, peerConnection } = useWebRTC();

  if (!inCall) return null;

  return (
    <VideoCallModal 
      localStream={localStream} 
      remoteStream={remoteStream} 
      onEndCall={endCall} 
      peerConnection={peerConnection}
    />
  );
};

export default App;
