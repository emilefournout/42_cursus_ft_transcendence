import { Socket } from "socket.io";

export class ConnectionStorage {
    private connectedSockets: Map<Socket, number> = new Map<Socket, number>();
    private connectedUsers: Map<number, Socket> = new Map<number, Socket>();

    constructor(){}

    public addUser(socket : Socket, userId: number) {
        this.connectedSockets.set(socket, userId)
        this.connectedUsers.set(userId, socket)
    }

    public removeUserBySocket(socket : Socket) {
        const userId = this.connectedSockets.get(socket)
        if (userId !== undefined) {
            this.connectedSockets.delete(socket)
            this.connectedUsers.delete(userId)
        }
    }

    public removeUserByUserId(userId : number) {
        const socket = this.connectedUsers.get(userId)
        if (userId !== undefined) {
            this.connectedSockets.delete(socket)
            this.connectedUsers.delete(userId)
        }
        return socket
    }
    
    public getUserIdFromSocket(socket: Socket) : number {
        return this.connectedSockets.get(socket)
    }   
}