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
  // const [socket, setsocket] = useState<WebSocket>()
  
  const socket = useSocket();

  if(roomId && socket){
    const req = {
      type: "join",
      payload: {
        roomId: roomId
      }
    }
    socket.send(JSON.stringify(req));
  }   

  useEffect(() => {
    if(roomId){
      setOpenRoom(true);
      setCreateComponent(false);
      setJoinComponent(false);
    }
  }, [roomId]);


  return (
    <>
        {openRoom ? (<ChatRoom roomId={roomId} socket={socket} />) : 
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

              {createComponent ? <CreateRoomCode/> : null }
              {joinComponent ? <JoinRoomBox setroom={setRoomId} /> : null }

            </div>
          </div>)
        }
    </>
  )
}

export default App;
