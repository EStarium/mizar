import { Server } from '../libs/Server';

const myServer = new Server(process);
let serverTimer: NodeJS.Timer;

process.on('message', (message: {event: string; ports: string; params: any}) => {
   switch (message.event) {
      case 'start':
         myServer.setPorts(message.ports);
         myServer.startServer(message.params);

         if (serverTimer === undefined) {
            serverTimer = setInterval(() => {
               myServer.getReports();
            }, 200);
         }
         break;
      case 'stop':
         myServer.stopServer(() => {
            if (serverTimer !== undefined) clearInterval(serverTimer);
            process.exit();
         });
         break;
      case 'reset':
         myServer.resetReports();
         break;
   }
});