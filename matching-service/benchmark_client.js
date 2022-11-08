import { io } from "socket.io-client";

const URL = "https://matching-service-dot-cs3219g20.as.r.appspot.com";
const users = 50;

let totalLatency = 0;
let maxLatency = -1;

const sleep = ms => new Promise(r => setTimeout(r, ms));

for (let i = 0; i < users; i++) {
    const socket = io(URL, { transports: ['websocket'] })
    const start = Date.now()
    socket.connect()

    console.log("pinging with user " + i)

    socket.emit("ping", () => {
        const latency = Date.now() - start;
        totalLatency += latency;
        maxLatency = Math.max(maxLatency, latency);
        console.log("user " + i + ": " + latency + "ms")
    })

    await sleep(1000);

    socket.disconnect();
}

console.log("average latency: " + (totalLatency / users) + "ms");
console.log("maximum latency: " + maxLatency + "ms");