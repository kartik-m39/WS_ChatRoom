import { useEffect, useState } from "react";

function useSocket(){
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080");
        setSocket(ws);

        // return () => {
        //     ws.close();
        // }

    },[]);

    return socket;
}

export default useSocket;