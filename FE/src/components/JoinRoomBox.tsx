import { useRef } from "react";

// setroom is a function which accepts roomid of string type and returns nothing

function JoinRoomBox({ setroom }: { setroom: (room: string) => void}) {
    const inputRoomId = useRef<HTMLInputElement>(null);
    
    function setroomId(){
        if(inputRoomId.current){
            setroom(inputRoomId.current.value);
        }
    }    

    function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            setroomId();
        }
    }

    return(
        <>
            <div className="mt-6 flex justify-between gap-4 ">
                <input ref={inputRoomId} onKeyUp={handleKeyPress} type="text" placeholder="Enter room code..." className="border rounded-md px-4 py-3 w-[70%]"></input>

                <button onClick={setroomId} className='bg-white rounded-md text-black px-8 py-3 w-[30%]'>Join</button>
            </div>
        </>
    )
}

export default JoinRoomBox;