"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
// kinda make a map like => 
// "roomId1": [array of sockets],
// "roomId2": [array of sockets],
// "roomId3": [array of sockets]
const allSockets = new Map();
wss.on("connection", (socket) => {
    console.log("User Connected");
    socket.on("message", (message) => {
        // console.log(message.toString())
        const parsedData = JSON.parse(message.toString());
        if (parsedData.type === "join") {
            if (!allSockets.has(parsedData.payload.roomId)) {
                allSockets.set(parsedData.payload.roomId, []);
            }
            allSockets.get(parsedData.payload.roomId).push(socket);
            const msg = {
                type: "alert",
                payload: {
                    message: `You joined room with code: ${parsedData.payload.roomId}`
                }
            };
            socket.send(JSON.stringify(msg));
            // allSockets.forEach((val, key) => {
            //     console.log(`Room: ${key}, Number of sockets: ${val.length}`);
            // })
        }
        if (parsedData.type === "chat") {
            let currentRoom;
            allSockets.forEach((val, key) => {
                for (let i = 0; i < val.length; i++) {
                    if (val[i] == socket) {
                        currentRoom = key;
                    }
                }
            });
            const sockets = allSockets.get(currentRoom);
            const chat = {
                type: "chat",
                payload: {
                    message: parsedData.payload.message
                }
            };
            sockets.forEach((item) => item.send(JSON.stringify(chat)));
        }
    });
    socket.on("close", () => {
        console.log("User disconnected");
    });
});
// const users = new Map();
// user.set("key1",{id: "key1",username: "kartik"})
// to get
// users.get("key1");
// allSockets.set("roomid": [array of sockets])
// joining a room
// tpye: join,
// payload: {
//     roomid: 76482
// }
// sending a message 
// type: chat,
// payload:{
//     message: "whatever message"
// }
