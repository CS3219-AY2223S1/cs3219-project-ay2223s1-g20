import { closeMatchHandler } from "./match-controller.js";

export function handleLeaveEvent(io, socket) {
    socket.rooms.forEach((roomID) => {
        if (roomID != socket.id) {
            var resp = {
                leavingUserID: socket.id,
                roomID: roomID
            }
            io.to(roomID).emit("closeRoom", resp);
            io.socketsLeave(roomID);
            closeMatchHandler(socket.id, roomID);
            console.log(`[socketIO] Room closed for roomID=${roomID}`);
        }
    }) 
    
}