import logo from './logo.svg';
import './App.css';
import EffectsPanel from "./EffectsPanel";
import fetchAsAudioBuffer from "fetch-as-audio-buffer";
import FileSelector from "./FileSelector";
import {useContext} from 'react'
import {UserContext} from "./Context";


function App() {
    const context = useContext(UserContext);
    let effectId = 0;
    let loadData = ()=>{
        console.log(context)
        effectId = context.data.effectId;
        let data = context.data;
        data.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        context.setData(data);
        const url = "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3";
        fetchAsAudioBuffer(context.data.audioCtx, url).then(
            (audioBuffer)=>{
                let sourceNode = context.data.audioCtx.createBufferSource()
                sourceNode.buffer = audioBuffer;
                let nodeWithEffect = context.data.getNodeWithEffect(context.data.effectId, sourceNode)
                nodeWithEffect.connect(context.data.audioCtx.destination)
                sourceNode.start();
            }
        )
    }




    return (

    <div className="App">
        <FileSelector/>
        <EffectsPanel/>
        <div onClick={loadData}>
          Start
        </div>

    </div>
  );
}

export default App;
