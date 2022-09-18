import { closeMatchHandler } from "./match-controller.js";

export function handleLeaveEvent(io, socket) {
    closeMatchHandler(socket.id, socket.rooms);
    socket.rooms.forEach((roomID) => {
        if (roomID != socket.id) {
            var resp = {
                leavingUserID: socket.id,
                roomID: roomID
            }
            io.to(roomID).emit("closeRoom", resp);
            io.socketsLeave(roomID);
            console.log(`[socketIO] Room closed for roomID=${roomID}`);
        }
    }) 
    
}