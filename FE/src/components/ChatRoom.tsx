import { useEffect, useRef, useState } from "react";
import { MdContentCopy } from "react-icons/md";

interface ChatItem {
  type: string;
  message: string;
}

function ChatRoom({roomId, socket, alert} : {roomId: string, socket: WebSocket, alert: string}){
    
    const [msg, setMsg] = useState<string>();
    const [displaymsg, setDisplayMsg] = useState<string>();
    const [chatArr, setChatArr] = useState<ChatItem[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // const chatArr: string[] = [];
    // setMsg(alert);

    function sendMessage() {
        if(inputRef.current){
            const chatMsg = inputRef.current.value;
            // console.log(chatMsg);

            setChatArr(prev => [...prev, {type: "sent", message: chatMsg}]);

            const req = {
                type: "chat",
                payload: {
                    message: chatMsg
                }
            }
            socket.send(JSON.stringify(req));

            inputRef.current.value = "";
        }
    }

    function copy(){
        navigator.clipboard.writeText(roomId);
        setDisplayMsg("Copied to clipboard!");
        setTimeout(() => {
            setDisplayMsg("")
        }, 3000);
    }

    function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    }

    useEffect(() => {
        if(socket){
            socket.onmessage = (event) => {

                const res = JSON.parse(event.data);
                console.log(res);
                
                if(res.type === "alert"){
                    setMsg(res.payload.message);
                }

                if(res.type === "chat"){
                    setChatArr((prev) => [...prev, {type: "received", message: res.payload.message}]);
                    // chatArr.push(res.payload.message);
                }
                
            }
        }
    }, [socket]);

    useEffect(() => {
        setMsg(alert)
    }, [alert])

    // Claude helped to fix chat scroll to newest messages
    // specifying HTMLDivElement in useRef solved the ts issues here
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatArr]);

    return (
        <>
        <div className='bg-black h-screen w-full flex flex-col justify-center items-center font'>
            <div className='text-white py-7 px-6 border-1 border-zinc-600 w-150 rounded-lg container flex flex-col gap-4'>

                <div>
                    {msg}
                </div>

                <div className="bg-zinc-800 flex justify-between items-center rounded-lg p-3 px-4">
                    <span>Room Code: <span className="font-bold">{roomId}
                        <button onClick={copy} className="ml-1 al">
                            <MdContentCopy />
                        </button>
                    </span>
                        
                    </span> 
                    <span>Users:</span>
                </div>

                <div ref={chatContainerRef} className="h-[430px] overflow-y-auto border border-zinc-600 rounded-lg p-4 flex flex-col gap-2 scrollbar-hide">
                    {chatArr.map((item, index) => {
                        const isUser = (item.type === "sent");
                        return (
                            <div
                                key={index}
                                className={`bg-white rounded-md text-black max-w-[60%] px-4 py-3 flex items-center h-auto ${
                                    isUser ? "ml-auto" : "mr-auto"
                                }`}
                            >
                                {item.message}
                            </div>
                        );
                    })}
                </div>


                <div className=" flex justify-between gap-4 ">
                    <input ref={inputRef} onKeyUp={handleKeyPress} type="text" placeholder="Type your heart out..." className="border border-zinc-600 rounded-lg px-4 py-3 w-[80%]"></input>

                    <button onClick={sendMessage} className='bg-white rounded-lg text-black px-8 py-3 w-[20%]'>Send</button>
                </div>

            </div>
            <div className="text-white justify-end items-end self-end mt-0 mr-8 font-semibold ">
                {displaymsg}
            </div>
        </div>
        </>
    )
}

export default ChatRoom;