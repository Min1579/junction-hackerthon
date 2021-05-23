import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'ws';

@WebSocketGateway(8080)
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  wsClients = [];

  handleConnection(client: any) {
    this.wsClients.push(client);
    client.send('connected!');
  }

  handleDisconnect(client) {
    for (let i = 0; i < this.wsClients.length; i++) {
      if (this.wsClients[i] === client) {
        this.wsClients.splice(i, 1);
        break;
      }
    }
    this.broadcast('disconnect',{});
  }

  broadcast(data, data2: any) {
    for (const c of this.wsClients) {
      console.log(data);
      console.log(data2);
      c.send(data, data2);
    }
  }

  @SubscribeMessage('getOn')
  onEvent(client: any, data: any) {
    return { event: 'events', data: 'test' };
  }
}
