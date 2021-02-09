import logo from './logo.svg';
import './App.css';
import EffectsPanel from "./EffectsPanel";
import EqualizerPanel from "./EqualizerPanel";
import FileSelector from "./FileSelector";
import {useContext, useState} from 'react'
import {UserContext} from "./Context";

function App() {
    const context = useContext(UserContext);
    const [wasStarted, setStarted] = useState();
    const [wasStopped, setStopped] = useState();
    const [wasFileLoaded, setFileLoaded] = useState(false);

    let setAudioCtx = ()=>{
        let data = context.data;
        data.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        context.setData(data);
    }
    if (!context.data.audioCtx)
        setAudioCtx();

    let startPlaying = ()=>{
        let nodeWithEffect = context.data.getNodeWithEffect(context.data.sourceNode)
        let nodeWithEqualizerAndEffects = context.data.getNodeWithEqualization(nodeWithEffect);
        nodeWithEqualizerAndEffects.connect(context.data.audioCtx.destination)
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
        setFileLoaded(false);
    }
    document.addEventListener("fileLoaded", ()=>{
        if (!wasFileLoaded) {
            setFileLoaded(true);
        }
    })
    return (
        <div className="App">
            <FileSelector/>
            <EffectsPanel/>
            <EqualizerPanel/>
            <div></div>
            <button onClick={startPlaying} id={"start"} disabled={wasStarted || ! wasFileLoaded}>
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
