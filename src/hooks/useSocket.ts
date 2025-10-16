import { useEffect, useRef } from 'react';
import { socketService } from '@/src/services/socket';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store';

export const useSocket = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isConnectedRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated && !isConnectedRef.current) {
      socketService.connect();
      isConnectedRef.current = true;
    } else if (!isAuthenticated && isConnectedRef.current) {
      socketService.disconnect();
      isConnectedRef.current = false;
    }

    return () => {
      if (isConnectedRef.current) {
        socketService.disconnect();
        isConnectedRef.current = false;
      }
    };
  }, [isAuthenticated]);

  return {
    connected: socketService.connected,
    joinGame: socketService.joinGame.bind(socketService),
    leaveGame: socketService.leaveGame.bind(socketService),
    sendGameMove: socketService.sendGameMove.bind(socketService),
    sendChatMessage: socketService.sendChatMessage.bind(socketService),
    createSquad: socketService.createSquad.bind(socketService),
    joinSquad: socketService.joinSquad.bind(socketService),
    leaveSquad: socketService.leaveSquad.bind(socketService),
    updateReadyStatus: socketService.updateReadyStatus.bind(socketService),
    startSquadGame: socketService.startSquadGame.bind(socketService),
    onGameUpdate: socketService.onGameUpdate.bind(socketService),
    onChatMessage: socketService.onChatMessage.bind(socketService),
    onSquadUpdate: socketService.onSquadUpdate.bind(socketService),
    offGameUpdate: socketService.offGameUpdate.bind(socketService),
    offChatMessage: socketService.offChatMessage.bind(socketService),
    offSquadUpdate: socketService.offSquadUpdate.bind(socketService),
  };
};