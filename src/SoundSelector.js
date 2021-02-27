import React, {useContext} from 'react'
import {UserContext} from "./Context";
import fetchAsAudioBuffer from "fetch-as-audio-buffer";
import s from './styles/soundSelector.module.css'

const SoundSelector = () => {
    const context = useContext(UserContext);
    const defaultWay = "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_5MG.mp3";
    let way = defaultWay;
    const setSourceNode = () => {

        fetchAsAudioBuffer(context.data.audioCtx, way).then(
            (audioBuffer) => {
                let sourceNode = context.data.audioCtx.createBufferSource();
                sourceNode.buffer = audioBuffer;
                let data = context.data;
                data.sourceNode = sourceNode;
                context.setData(data);
                document.dispatchEvent(new Event("fileLoaded"))
            }
        ).catch((exeption) => {
            alert("Error while loading");
            console.log(exeption);
        })
    };

    (() => {
        let data = context.data;
        data.setSourceNode = setSourceNode;
        context.setData(data);
    })();

    console.log(s);
    return (<div className={s['sound-selector']}>
        <input className={s['sound-selector__input']} type={"text"} id={"selectWay"} onChange={() => {
            way = document.getElementById("selectWay").value;
        }}/>
        <br/>
        <button className={s['sound-selector__button_default']} onClick={() => {
            document.getElementById("selectWay").value = defaultWay;
            way = defaultWay;
        }}>
            Путь по умолчанию
        </button>
        <button className={s['sound-selector__button_download']} onClick={setSourceNode}>Загрузить</button>
    </div>)
};
export default SoundSelector;
