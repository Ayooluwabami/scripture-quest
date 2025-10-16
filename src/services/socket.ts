import { io, Socket } from 'socket.io-client';
import { store } from '@/src/store';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(): void {
    if (this.socket?.connected) return;

    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
    
    this.socket = io(API_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Game-specific events
    this.socket.on('game-update', (data) => {
      console.log('Game update received:', data);
      // Dispatch to Redux store
      store.dispatch({ type: 'game/updateSession', payload: data });
    });

    this.socket.on('chat-message', (data) => {
      console.log('Chat message received:', data);
      // Handle chat message
    });

    this.socket.on('player-joined', (data) => {
      console.log('Player joined:', data);
      // Handle player joining
    });

    this.socket.on('player-left', (data) => {
      console.log('Player left:', data);
      // Handle player leaving
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Game room management
  joinGame(gameId: string): void {
    if (this.socket) {
      this.socket.emit('join-game', gameId);
    }
  }

  leaveGame(gameId: string): void {
    if (this.socket) {
      this.socket.emit('leave-game', gameId);
    }
  }

  // Game actions
  sendGameMove(gameId: string, moveData: any): void {
    if (this.socket) {
      this.socket.emit('game-move', { gameId, ...moveData });
    }
  }

  sendChatMessage(gameId: string, message: string): void {
    if (this.socket) {
      const state = store.getState();
      const user = state.auth.user;
      
      this.socket.emit('chat-message', {
        gameId,
        message,
        userId: user?.id,
        username: user?.username,
      });
    }
  }

  // Squad management
  createSquad(squadData: any): void {
    if (this.socket) {
      this.socket.emit('create-squad', squadData);
    }
  }

  joinSquad(squadId: string): void {
    if (this.socket) {
      this.socket.emit('join-squad', squadId);
    }
  }

  leaveSquad(squadId: string): void {
    if (this.socket) {
      this.socket.emit('leave-squad', squadId);
    }
  }

  updateReadyStatus(squadId: string, isReady: boolean): void {
    if (this.socket) {
      this.socket.emit('update-ready-status', { squadId, isReady });
    }
  }

  startSquadGame(squadId: string): void {
    if (this.socket) {
      this.socket.emit('start-squad-game', squadId);
    }
  }

  // Event listeners
  onGameUpdate(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('game-update', callback);
    }
  }

  onChatMessage(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('chat-message', callback);
    }
  }

  onSquadUpdate(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('squad-update', callback);
    }
  }

  // Remove event listeners
  offGameUpdate(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.off('game-update', callback);
    }
  }

  offChatMessage(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.off('chat-message', callback);
    }
  }

  offSquadUpdate(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.off('squad-update', callback);
    }
  }

  get connected(): boolean {
    return this.isConnected;
  }
}

export const socketService = new SocketService();