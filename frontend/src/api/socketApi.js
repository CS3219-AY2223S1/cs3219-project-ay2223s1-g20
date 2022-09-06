import { URI_MATCHING_SVC, MATCHING_SVC_PREFIX } from '../util/configs';
import io from 'socket.io-client';

export let io_socket = io(MATCHING_SVC_PREFIX);

export const setSocket = (socket) => {
    io_socket = socket;
    console.log(io_socket);
}