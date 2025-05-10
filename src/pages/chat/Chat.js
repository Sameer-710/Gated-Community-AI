import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import "./Chat.css";

const BACKEND_URL = `${process.env.REACT_APP_BACKEND_URL}`; 

// Configure axios with default authorization header
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

const socket = io(BACKEND_URL, { path: "/chat" });

const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const { userId: selectedUserId } = useParams();
  const navigate = useNavigate();
  const messagesContainerRef = useRef(null);  

  // Check authentication
  useEffect(() => {
    if (!userId || !token) {
      navigate("/login");
      return;
    }
  }, [userId, token, navigate]);

  // Fetch conversations
  useEffect(() => {
    if (!userId) return;

    const fetchConversations = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/messages/conversations/${userId}`);
        setConversations(res.data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          navigate("/login");
        }
        setConversations([]);
      }
    };

    fetchConversations();
  }, [userId, selectedUserId, selectedUser, navigate]);

  useEffect(() => {
    const handleReceiveMessage = (newMessage) => {
      if (
        (newMessage.sender === userId && newMessage.receiver === selectedUser?._id) ||
        (newMessage.sender === selectedUser?._id && newMessage.receiver === userId)
      ) {
        setMessages((prev) => {
          
          if (!prev.some((msg) => msg._id === newMessage._id)) {
            return [...prev, newMessage];
          }
          return prev;
        });
      }
    };
  
    socket.off("receive_message"); 
    socket.on("receive_message", handleReceiveMessage);
  
    return () => {
      socket.off("receive_message", handleReceiveMessage); 
    };
  }, []); 
  
  // Fetch selected user data
  useEffect(() => {
    if (selectedUserId && (!selectedUser || selectedUser._id !== selectedUserId)) {
      console.log("Fetching selected user for ID:", selectedUserId); 
      axios.get(`${BACKEND_URL}/api/users/${selectedUserId}`)
        .then((res) => {
          setSelectedUser(res.data);
        })
        .catch((err) => {
          console.error("Error fetching selected user:", err);
          if (err.response && err.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            navigate("/login");
          } else {
            navigate("/chat");
          }
        });
    }
  }, [selectedUserId, selectedUser, navigate]);

  // Fetch messages between users
  const fetchMessages = useCallback(async () => {
    if (!selectedUser) return;
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/messages/${userId}/${selectedUser._id}`);
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/login");
      }
      setMessages([]);
    }
  }, [selectedUser, userId, navigate]);

  // Join room and load messages when user selected
  useEffect(() => {
    if (selectedUser) {
      const room = `${userId}${selectedUser._id}`;
  
      
      socket.emit("leave_room", room);
  
      
      socket.emit("join_room", room);
  
      fetchMessages();
    }
  
    return () => {
      if (selectedUser) {
        const room = `${userId}${selectedUser._id}`;
        socket.emit("leave_room", room);
      }
    };
  }, [selectedUser, userId, fetchMessages]);
  

  
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!selectedUser || (!messageInput.trim() && !imageFile)) return;

    const room = `${userId}${selectedUser._id}`;
    const newMessage = {
      sender: userId,
      receiver: selectedUser._id,
      room,
      timestamp: new Date().toISOString(),
    };

    if (messageInput.trim()) {
      newMessage.message = messageInput.replace(/:smile:/g, "😊").replace(/:heart:/g, "❤️");
    }

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        newMessage.image = reader.result;
        socket.emit("send_message", newMessage);
        setMessages((prev) => [...prev, newMessage]);
        setImageFile(null);
      };
      reader.readAsDataURL(imageFile);
    } else {
      socket.emit("send_message", newMessage);
      setMessages((prev) => [...prev, newMessage]);
    }

    setMessageInput("");
    setShowEmojiPicker(false);
  };

  const handleEmojiClick = (emojiObject) => {
    setMessageInput((prev) => prev + emojiObject.emoji);
  };

  const handleConversationSelect = (user) => {
    setSelectedUser(user);
    navigate(`/chat/${user._id}`, { replace: true });
  };

  
  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="chat-container chat-cool">
      <div className="chat-particles"></div>
      {/* Navigation Bar */}
      <nav className="chat-nav">
        <button className="chat-nav-button" onClick={handleDashboardClick}>
          Dashboard
        </button>
      </nav>
      <div className="chat-box chat-cool-box" style={{ marginTop: '70px' }}> {/* Adjusted margin-top */}
        <div className="chat-sidebar">
          <h3 className="chat-sidebar-title">Conversations</h3>
          <div className="chat-conversations">
            {conversations.map((conv) => (
              <div
                key={conv._id}
                className={`chat-conversation ${selectedUser?._id === conv._id ? "chat-selected" : ""}`}
                onClick={() => handleConversationSelect(conv)}
              >
                <p className="chat-conv-name">{conv.name}</p>
                <p className="chat-conv-last">{conv.lastMessage}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="chat-main">
          {selectedUser ? (
            <>
              <h3 className="chat-main-title">Chat with {selectedUser.name}</h3>
              <div className="chat-messages" ref={messagesContainerRef}> {/* Added ref to container */}
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`chat-message ${msg.sender === userId ? "chat-sent" : "chat-received"}`}
                  >
                    <strong>{msg.sender === userId ? "You" : selectedUser.name}:</strong>
                    {msg.message && <p>{msg.message}</p>}
                    {msg.image && <img src={msg.image} alt="Chat" className="chat-image" />}
                    <span className="chat-timestamp">
                      {new Date(msg.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="chat-input-section">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message... (e.g., :smile:)"
                  className="chat-cool-input"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="chat-file-input"
                />
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="chat-emoji-button"
                >
                  😊
                </button>
                {showEmojiPicker && (
                  <div className="chat-emoji-picker">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}
                <button onClick={sendMessage} className="chat-cool-button">
                  <span>Send</span>
                  <span className="chat-button-effect"></span>
                </button>
              </div>
            </>
          ) : (
            <p className="chat-no-selection">Select a conversation to start chatting</p>
          )}
        </div>

        <div className="chat-decor">
          <div className="chat-orbit-ring"></div>
          <div className="chat-orbit-ring chat-ring-2"></div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;