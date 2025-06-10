import { useEffect, useRef, useState } from "react";

function ChatRoom({roomId, socket} : {roomId: string, socket: WebSocket}){
    
    const [msg, setMsg] = useState<string>();
    const [chatArr, setChatArr] = useState<string[]>(["hi there"]);
    const inputRef = useRef<HTMLInputElement>(null);

    // const chatArr: string[] = [];

    function sendMessage() {
        if(inputRef.current){
            const chatMsg = inputRef.current.value;
            // console.log(chatMsg);
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

    function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    }

    useEffect(() => {
        if(socket){
            socket.onmessage = (event) => {

                const res = JSON.parse(event.data);

                if(res.type === "alert"){
                    setMsg(res.payload.message);
                }

                if(res.type === "chat"){
                    setChatArr((prev) => [...prev, res.payload.message]);
                    // chatArr.push(res.payload.message);
                }
            }
        }
    }, [socket])

    return (
        <>
        <div className='bg-black h-screen w-full flex justify-center items-center font'>
            <div className='text-white py-7 px-6 border-1 border-zinc-600 w-150 rounded-lg container flex flex-col gap-4 '>

                <div>
                    {msg}
                </div>

                <div className="bg-zinc-800 flex justify-between items-center rounded-lg p-3 px-4">
                    <span>Room Code: <span className="font-bold">{roomId}</span></span> 
                    <span>Users:</span>
                </div>

                <div className="h-[430px] overflow-y-scroll border border-zinc-600 rounded-lg p-4 space-y-2 flex flex-col justify-end items-end">
                    {/* create an array to store chats */}
                        {chatArr.map((item, index) => {
                            return (
                                <ul key={index} className="list-none bg-white rounded-md text-black  max-w-[25%] px-4 py-3 flex justify-end items-center h-10">
                                    {item}
                                </ul>
                            )
                        })}
                </div>

                <div className=" flex justify-between gap-4 ">
                    <input ref={inputRef} onKeyUp={handleKeyPress} type="text" placeholder="Type your heart out..." className="border border-zinc-600 rounded-lg px-4 py-3 w-[80%]"></input>

                    <button onClick={sendMessage} className='bg-white rounded-lg text-black px-8 py-3 w-[20%]'>Send</button>
                </div>

            </div>

        </div>
        </>
    )
}

export default ChatRoom;