import {HubConnectionBuilder, LogLevel} from '@microsoft/signalr';
import {usePersonalStore} from '@/stores/modules/personal/personal';
import mittBus from '@/utils/mittBus';

const personalStore = usePersonalStore();
const baseURL = import.meta.env.VITE_REMOTE_SERVICE_BASE_URL;
export const initSignalR = async () => {
    const connection = new HubConnectionBuilder()
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .withUrl(`${baseURL}/signalr?encrypted-token=${encodeURIComponent(personalStore.token.encryptedToken)}`)
        .build();
    connection.on('getNotification', (notification) => {
        mittBus.emit('notification.Received', notification);
    });
    const start = async () => {
        try {
            await connection.start();
            console.debug('SignalR connected');
        } catch (error) {
            console.debug('SignalR connection is error:' + error);
            setTimeout(start, 5000);
        }

    };
    connection.onreconnecting(error => {
        console.debug('SignalR connection lost due to error: ' + error + '. Reconnecting...');
    });
    connection.onreconnected(connectionId => {
        console.debug('SignalR reestablished. Connected with connectionId: ' + connectionId);
    });
    connection.onclose(async (error) => {
        if (error) {
            console.debug('SignalR connection closed with error: ' + error);
        } else {
            console.debug('SignalR disconnected');
        }
        // await start();
    });
    await start();
};



