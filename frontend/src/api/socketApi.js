import { URI_MATCHING_SVC } from '../util/configs';
import io from 'socket.io-client';

export const socket = io(URI_MATCHING_SVC);

