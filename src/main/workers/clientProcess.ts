import { ClientHost } from 'common/interfaces';
import { Sender, SenderParams } from '../libs/Sender';

const Sends = new Sender(process);
let clientTimer: NodeJS.Timer;

process.on('message', (message: { event: string; hosts: ClientHost[]; params: SenderParams}) => {
   switch (message.event) {
      case 'start':
         Sends.setHosts(message.hosts);
         Sends.setParams(message.params);

         Sends.startFullTest(() => {
            const response = {
               event: 'finish',
               content: 'Test concluso'
            };
            process.send(response);
            if (clientTimer !== undefined) clearInterval(clientTimer);
            Sends.getReports();
         });

         Sends.getReports();

         if (clientTimer === undefined) {
            clientTimer = setInterval(() => {
               Sends.getReports();
            }, 200);
         }
         break;
      case 'startStep':
         Sends.setHosts(message.hosts);
         Sends.setParams(message.params);

         Sends.connectClients(() => {
            const response = {
               event: 'log',
               content: { message: 'Client connessi', color: '' }
            };
            process.send(response);
         });

         Sends.getReports();

         if (clientTimer === undefined) {
            clientTimer = setInterval(() => {
               Sends.getReports();
            }, 200);
         }
         break;
      case 'sendStep':
         Sends.sendMessages(() => {
            const response = {
               event: 'log',
               content: { message: 'Messaggi inviati', color: '' }
            };
            process.send(response);
         });
         break;
      case 'stop':
         Sends.stopClients(() => {
            if (clientTimer !== undefined) clearInterval(clientTimer);
            Sends.getReports();
            process.exit();
         });
         break;
   }
});
