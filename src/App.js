import logo from './logo.svg';
import './App.css';
import fetchAsAudioBuffer from "fetch-as-audio-buffer";
import overdrive from "web-audio-components/overdrive";
import SimpleReverb from "web-audio-components/simple-reverb"


function App() {
    let checkSelectedEffect = ()=>{
        if (document.getElementById("over").checked)
            return 1;
        if (document.getElementById("reverb").checked)
            return 2;
        return 0;
    }
    let effectId = 0;
    let loadData = ()=>{
        effectId = checkSelectedEffect();
        alert(effectId)
        let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const url = "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3";
        fetchAsAudioBuffer(audioCtx, url).then(
            (audioBuffer)=>{
                let sourceNode = audioCtx.createBufferSource()
                sourceNode.buffer = audioBuffer;
                if (effectId) {
                    let effect = createEffect(audioCtx);
                    sourceNode.connect(effect.input);
                    effect.connect(audioCtx.destination);
                }
                else
                    sourceNode.connect(audioCtx.destination)
                sourceNode.start();
            }
        )
    }

    let createEffect = (context)=>{
        if (effectId === 1){
            let param = {
                preBand: 1.0,
                color: 4000,
                drive: 0.8,
                postCut: 8000
            }
            return new overdrive(context, param)
        }
        if (effectId === 2) {
            let param = {
                seconds: 3,
                decay: 2,
                reverse: 1
            }
            return new SimpleReverb(context, param)
        }
    }


    return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div onClick={loadData}>
          Start
        </div>
          <div>
              <div id={"effectSelector"}>
                  <input type={"radio"} id = "over" name = "effect" value={"2"}/> Овердрайв <br/>
                  <input type={"radio"} id = "reverb" name = "effect" value={"1"}/> Ревербация <br/>
                  <input type={"radio"} id = "clr" name = "effect" value={"0"}/> Чистый звук <br/>
              </div>
          </div>
      </header>
    </div>
  );
}

export default App;
