import logo from './logo.svg';
import './App.css';
import EffectsPanel from "./EffectsPanel";
import EqualizerPanel from "./EqualizerPanel";
import FileSelector from "./FileSelector";
import {useContext, useState} from 'react'
import {UserContext} from "./Context";
import Controls from "./Controls";

function App() {
    const context = useContext(UserContext);

    let setAudioCtx = ()=>{
        let data = context.data;
        data.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        context.setData(data);
    }
    if (!context.data.audioCtx)
        setAudioCtx();

    return (
        <div className="App">
            <FileSelector/>
            <EffectsPanel/>
            <EqualizerPanel/>
            <Controls/>
        </div>
    );
}

export default App;
