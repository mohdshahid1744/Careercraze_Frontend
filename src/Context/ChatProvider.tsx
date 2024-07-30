import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Redux/Store/Store';

interface ChatContextType {
  selectedChat: any;
  setSelectedChat: React.Dispatch<React.SetStateAction<any>>;
  users: any;
  setUsers: React.Dispatch<React.SetStateAction<any>>;
  notification: any[];
  setNotification: React.Dispatch<React.SetStateAction<any[]>>;
  chats: any;
  setChats: React.Dispatch<React.SetStateAction<any>>;
}
const ChatContext = createContext<ChatContextType | undefined>(undefined);
interface ChatProviderProps {
  children: ReactNode;
}

const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState<any>();
  const [users, setUsers] = useState<any>();
  const [notification, setNotification] = useState<any[]>([]);
  const [chats, setChats] = useState<any>();
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    setUsers(user);

    if (!user) navigate("/");
  }, [user, navigate]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        users,
        setUsers,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatState must be used within a ChatProvider");
  }
  return context;
};

export default ChatProvider;
