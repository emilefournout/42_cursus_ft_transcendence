import { error } from 'console';
import { io, Socket } from 'socket.io-client'

export class ChatSocket {
    private static singleton: ChatSocket;
    private socketIo;

    private constructor(){
        this.socketIo = io('http://localhost:3001')
    }

    public static getInstance(){
        if (!this.singleton)
            this.singleton = new ChatSocket();
        return this.singleton;
    }

    get socket(){
        return this.socketIo;
    }
}

export class GameSocket {
    private static singleton: GameSocket;
    private socketIo;

    private constructor(){
        const access_token = localStorage.getItem('access_token')
        if (!access_token)
            throw new Error("Access token not found")
        this.socketIo = io('http://localhost:3002', {
            extraHeaders: {
                authentication: access_token
            }
        })
    }

    public static getInstance(){
        if (!this.singleton)
            this.singleton = new GameSocket();
        return this.singleton;
    }

    get socket(){
        return this.socketIo;
    }
}
