import { MdContentCopy } from "react-icons/md";
import { useMemo, useState } from "react";

function randomCode(){
    let code = '';
    const arr = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890";
    for(let i = 0; i < 6; i++){
        code += arr[(Math.floor(Math.random() * arr.length))];
    };

    return code;

}

function CreateRoomCode(){

    // WTF is useMemo hook doing idk
    const code = useMemo(() => randomCode(), []);
    const [msg, setMsg] = useState<string>("")

    function copy(){
        navigator.clipboard.writeText(code);
        setMsg("Copied to clipboard!");
        setTimeout(() => {
            setMsg("")
        }, 3000);
    }

    return(
        <>
            <div className="text-gray-400 py-7 px-6 border-1 border-white w-[100%] rounded-md container bg-zinc-800 flex flex-col justify-center items-center mt-7">
                <div>
                    Share this code with your friend
                </div>
                <div className="text-2xl mt-1 font-bold flex justify-center items-center">
                    <div className="mr-2">
                        {code}
                    </div>
                    <button onClick={copy}>
                        <MdContentCopy />
                    </button>
                </div>

                <div>
                   { msg }
                </div>
            </div>
        </>
    )
}

export default CreateRoomCode;