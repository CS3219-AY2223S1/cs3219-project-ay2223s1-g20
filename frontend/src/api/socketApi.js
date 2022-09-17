import { URI_MATCHING_SVC, MATCHING_SVC_PREFIX } from '../util/configs';
import io from 'socket.io-client';

// export let io_socket = io(MATCHING_SVC_PREFIX);
export let io_socket = null;

export const setSocket = (socket) => {
    io_socket = socket;
}

export const haveSocket = () => {
    return io_socket != null;
}

export const getSocket = () => {
    if (!haveSocket()) {
        console.log('socket connecting');
        const socket = io(URI_MATCHING_SVC, { transports: ["websocket"] });
        socket.connect();
        setSocket(socket);
    }
    console.log(io_socket);
    return io_socket;
}