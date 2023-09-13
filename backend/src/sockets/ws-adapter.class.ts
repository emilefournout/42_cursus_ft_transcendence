import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'socket.io'; // Importa Server desde 'socket.io'
import * as https from 'https';

export class WsAdapter extends IoAdapter {
  protected ioServer: Server;

  constructor(protected server: https.Server) {
    super();

    const options = {
      cors: {
        origin: true,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    };

    this.ioServer = new Server(server, options);
  }

  createIOServer(port: number) {
    return this.ioServer;
  }
}
