import React, {useContext} from 'react'
import {UserContext} from "./Context";
import fetchAsAudioBuffer from "fetch-as-audio-buffer";

let FileSelector = ()=>{
    const context = useContext(UserContext);
    const defaultWay = "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_5MG.mp3";
    let way = defaultWay;
    let setSourceNode = ()=>{
        fetchAsAudioBuffer(context.data.audioCtx, way).then(
            (audioBuffer)=>{
                let sourceNode = context.data.audioCtx.createBufferSource()
                sourceNode.buffer = audioBuffer;
                let data = context.data;
                data.sourceNode = sourceNode;
                context.setData(data)
                document.dispatchEvent(new Event("fileLoaded"))
            }
        ).catch((exeption)=>{
            alert("Error while loading")
            console.log(exeption)
        })
    }

    (()=>{
        let data = context.data;
        data.setSourceNode = setSourceNode;
        context.setData(data)
    })()
    return <div>
        <input type={"text"} id={"selectWay"} onChange={()=>{
            way = document.getElementById("selectWay").value;
        }}/>
        <br/>
        <button onClick={()=>{
            document.getElementById("selectWay").value = defaultWay;
            way = defaultWay;
        }}>
            Путь по умолчанию
        </button>
        <button onClick={setSourceNode}>Загрузить</button>
    </div>
}
export default FileSelector;
