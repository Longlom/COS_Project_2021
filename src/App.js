import './App.css';
import EffectsPanel from "./EffectsPanel";
import EqualizerPanel from "./EqualizerPanel";
import SoundSelector from "./SoundSelector";
import {useContext} from 'react'
import {UserContext} from "./Context";
import Controls from "./Controls";
import Equaliser from "./Equaliser";

function App() {
    const context = useContext(UserContext);

    const setAudioCtx = () => {
        let data = context.data;
        data.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        context.setData(data);
    };

    if (!context.data.audioCtx)
        setAudioCtx();

    return (
        <div className="App">
            <SoundSelector/>
            <EffectsPanel/>
            <EqualizerPanel/>
            <Controls/>
            <Equaliser/>
        </div>
    );
}

export default App;
