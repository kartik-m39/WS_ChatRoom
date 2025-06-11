import { useEffect, useState } from "react";

function useSocket(){
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(() => {
        const ws = new WebSocket("https://ws-chatroom.onrender.com");
        setSocket(ws);

        // return () => {
        //     ws.close();
        // }

    },[]);

    return socket;
}

export default useSocket;