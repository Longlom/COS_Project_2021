import logo from './logo.svg';
import './App.css';
import EffectsPanel from "./EffectsPanel";
import FileSelector from "./FileSelector";
import {useContext, useState} from 'react'
import {UserContext} from "./Context";

function App() {
    const context = useContext(UserContext);
    const [wasStarted, setStarted] = useState();
    const [wasStopped, setStopped] = useState();


    let setAudioCtx = ()=>{
        let data = context.data;
        data.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        context.setData(data);
    }
    setAudioCtx();
    let startPlaying = ()=>{
        if (!context.data.sourceNode){
            alert("Требуется загрузить исходный файл!")
            return null;
        }
        let nodeWithEffect = context.data.getNodeWithEffect(context.data.effectId, context.data.sourceNode)
        nodeWithEffect.connect(context.data.audioCtx.destination)
        context.data.sourceNode.start();
        setStarted(true);
    }
    let stopPlaying = ()=>{
        if (context.data.sourceNode) {
            context.data.sourceNode.stop();
            setStopped(true);
        }

    }
    let reinit = ()=>{
        setAudioCtx();
        context.data.setSourceNode();
        setStopped(false);
        setStarted(false);
    }
    return (
        <div className="App">
            <FileSelector/>
            <EffectsPanel/>
            <div></div>
            <button onClick={startPlaying} id={"start"} disabled={wasStarted}>
                Start
            </button>
            <button onClick={stopPlaying} id={"stop"} disabled={!(wasStarted && !wasStopped)}>
                Stop
            </button>
            <button onClick={reinit} id={"reinit"} disabled={!wasStopped}>
            Reinit
            </button>
        </div>
    );
}

export default App;
