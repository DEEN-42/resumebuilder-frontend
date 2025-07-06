// handlers/socketHandlers.js
import io from 'socket.io-client';
import { showSuccess, showError, showWarning, showInfo } from '../utils/toast.jsx';
export const createSocketHandlers = (
  id,
  setSocket,
  setIsConnected,
  setConnectedUsers,
  setLastUpdatedBy,
  setResumeData,
  setGlobalStyles,
  setSelectedTemplate,
  isUpdatingFromSocketRef
) => {
  const initializeSocket = () => {
    if (!id) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const newSocket = io('http://localhost:3030', {
      auth: { token },
      query: { resumeId: id }
    });

    newSocket.on('connect', () => {
      // console.log('Connected to Socket.IO server');
      setIsConnected(true);
      newSocket.emit('join-resume-room', id);
    });

    newSocket.on('disconnect', () => {
      // console.log('Disconnected from Socket.IO server');
      setIsConnected(false);
    });

    newSocket.on('resume-updated', (data) => {
      // console.log('Received resume update from:', data.updatedBy);
      setLastUpdatedBy(data.updatedBy);
      
      // Set flag to prevent triggering save when updating from socket
      isUpdatingFromSocketRef.current = true;
      
      // Apply the updates
      const { updates } = data;
      
      if (updates.resumeData) {
        setResumeData(prev => ({
          ...prev,
          ...updates.resumeData
        }));
      }
      
      if (updates.globalStyles) {
        setGlobalStyles(prev => ({
          ...prev,
          ...updates.globalStyles
        }));
      }
      
      if (updates.selectedTemplate) {
        setSelectedTemplate(updates.selectedTemplate);
      }

      // Reset flag after a short delay
      setTimeout(() => {
        isUpdatingFromSocketRef.current = false;
      }, 100);
    });

    newSocket.on('user-joined', (data) => {
      // console.log('User joined:', data.userEmail);
      showNotification(`User left: ${data.userEmail}`,info);
      setConnectedUsers(prev => [...prev, data.userEmail]);
    });

    newSocket.on('user-left', (data) => {
      // console.log('User left:', data.userEmail);
      showNotification(`User left: ${data.userEmail}`,info);
      setConnectedUsers(prev => prev.filter(email => email !== data.userEmail));
    });

    newSocket.on('users-in-room', (users) => {
      // console.log('Users in room:', users);
      setConnectedUsers(users);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  };

    // Utility function to show notifications (replace with your preferred notification system)
    const showNotification = (message, type) => {
      if(type === 'error'){
        showError(message);
      } else if(type === 'success'){
        showSuccess(message);
      } else if(type === 'warning'){
        showWarning(message);
      } else if(type === 'info'){
        showInfo(message);
      } else {
        alert(message); // Fallback only
      }
    };

  return {
    initializeSocket
  };
};