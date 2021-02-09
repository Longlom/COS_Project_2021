import React, {useContext} from 'react'
import {UserContext} from "./Context";
import fetchAsAudioBuffer from "fetch-as-audio-buffer";

let FileSelector = ()=>{
    const context = useContext(UserContext);
    const dafaultWay = "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_5MG.mp3";
    return <div>
        <input type={"text"} id={"selectWay"} onChange={()=>{
            let data = context.data;
            data.wayToAudiofile = document.getElementById("selectWay").value;
            context.setData(data)
        }}/>
        <button onClick={()=>{
            document.getElementById("selectWay").value = dafaultWay;
            let data = context.data;
            data.wayToAudiofile = dafaultWay;
            context.setData(data)
            alert(context.data.wayToAudiofile)
        }}>
            Путь по умолчанию
        </button>
    </div>
}
export default FileSelector;
