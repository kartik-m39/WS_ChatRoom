import { useEffect, useState } from 'react'
import CreateRoomCode from './components/CreateRoomCode'
import JoinRoomBox from './components/JoinRoomBox';
import ChatRoom from './components/ChatRoom';
import useSocket from './hooks/useSocket';

function App() {
  const [createComponent, setCreateComponent] = useState<boolean>(false);
  const [joinComponent, setJoinComponent] = useState<boolean>(false);
  const [openRoom, setOpenRoom] = useState<boolean>(false);
  const [roomId, setRoomId] = useState<string>("");
  // const [socket, setsocket] = useState<WebSocket>();
  const [msg, setMsg] = useState<string>("");
  
  const socket = useSocket(); // can return either WS || null so check socket? exists before rendering ChatRoom.tsx

// This is running unconditionally whenever the component mounts causing the the join request to be sent twice so putting it in UseEffect

// Main issues:
// 1. Running this code directly in component body causes it to execute on EVERY render,not just when roomId changes. This sends duplicate join requests.

// 2. When ChatRoom component first mounts, both roomId and socket already exist (passed from parent), so join request gets sent immediately.Then when roomId changes from "" to actual room ID, the useEffect runs again due to dependency array [roomId, socket], sending a second join request.

// 3. If socket gets recreated (component remount, connection issues), the effect runs again even for the same roomId, sending unnecessary join requests.

  // if(roomId && socket){
  //   const req = {
  //     type: "join",
  //     payload: {
  //       roomId: roomId
  //     }
  //   }
  //   socket.send(JSON.stringify(req));
  // }   

  useEffect(() => {
    if(roomId && socket){
      const req = {
        type: "join",
        payload: {
          roomId: roomId
        }
      }
      socket.send(JSON.stringify(req));

      socket.onmessage = (event) => {
        const res = JSON.parse(event.data);

        if(res.type === "alert"){
          setMsg(res.payload.message);
        }
      }

      setOpenRoom(true);
      setCreateComponent(false);
      setJoinComponent(false);
    }
  }, [roomId, socket]);


  return (
    <>
        {openRoom && socket ? (<ChatRoom roomId={roomId} socket={socket} alert={msg} />) : 
          (<div className='bg-black h-screen w-full flex justify-center items-center font'>
            <div className='text-white py-7 px-6 border-1 border-white w-150 rounded-md container '>

              <div className='font-extrabold text-3xl mb-8'>
                Chat real time Using websockets!
              </div>

              <div className='flex justify-between text-center '>
                <button className='bg-white rounded-md text-black px-6 py-3 w-[45%]' onClick={() => setCreateComponent((prev) => !prev)}>
                  Create a new room
                </button>

                <button className='bg-white rounded-md text-black px-6 py-3 w-[45%]' onClick={() => setJoinComponent((prev) => !prev)}>
                  Join a room
                </button>
              </div>

              {joinComponent ? <JoinRoomBox setroom={setRoomId} /> : null }
              {createComponent ? <CreateRoomCode/> : null }

            </div>
          </div>)
        }
    </>
  )
}

export default App;
