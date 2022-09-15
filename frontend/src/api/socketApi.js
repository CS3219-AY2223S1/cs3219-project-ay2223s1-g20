import { URI_MATCHING_SVC, MATCHING_SVC_PREFIX } from '../util/configs';
import io from 'socket.io-client';

// export let io_socket = io(MATCHING_SVC_PREFIX);
export let io_socket = null;

export const setSocket = (socket) => {
    io_socket = socket;
    console.log(io_socket);
}

export const haveSocket = () => {
    return io_socket != null;
}