import React, {useContext, useState} from 'react'
import {UserContext} from "./Context";
import overdrive from "web-audio-components/overdrive";
import SimpleReverb from "web-audio-components/simple-reverb";

let EffectsPanel = ()=>{
    const context = useContext(UserContext);
    const [isLoaded, setLoaded] = useState(false);
    const [effectId, setEffectId] = useState(0);
    const [param, setParams] = useState({});
    const minGainOD = -100;
    const maxGainOD = 100;
    const defauldDainOD = 1.0;
    const minColor = 20;
    const maxColor = 20000;
    const defaultColor = 4000;
    const minOd = 0.0;
    const maxOd = 1.0;
    const defaultOd = 0.1;
    const defaultPostCut = 8000;
    const minPostCut = 20;
    const maxPostCut = 20000;
    const minSecondsRv = 0.1;
    const maxSecondsRv = 5;
    const defaultSecondsRv = 3;
    const defaultDecayRv = 2;
    const minDecayRv = 0.1;
    const maxDecayRv = 5;
    let getNodeWithEffect = (sourceNode)=>{
        if (effectId) {
            let effect = createEffect(context.data.audioCtx, effectId);
            sourceNode.connect(effect.input);
            return effect;
        }
        else
            return sourceNode;
    }
    let createHandler = ()=>{
        if (effectId === 2) {
            let styleOd = {
                display:"inline-block",
                width:"25%"
            }
            let commonStyle = {
                border:"1px solid black",
                margin:"2%"
            }
            return <div style={commonStyle}>
                <div>Overdrive Settings</div>
                <div style={styleOd}>
                    <div>
                        preBand {/*Pre-distortion bandpass filter wet gain coefficient.*/}
                    </div>
                    <input type={"range"}
                           min={minGainOD}
                           max={maxGainOD}
                           defaultValue={defauldDainOD}
                           id = {"preBandOD"}
                           onChange={()=>{
                               let paramLocal = param;
                               paramLocal.preBand = document.getElementById("preBandOD").value;
                               setParams(paramLocal);
                               console.log(param)
                           }}
                    />
                </div>
                <div style={styleOd}>
                    <div>
                        color {/*Pre-distortion bandpass filter frequency.*/}
                    </div>
                    <input type={"range"}
                           min={minColor}
                           max={maxColor}
                           defaultValue={defaultColor}
                           id = {"color"}
                           onChange={()=>{
                               let paramLocal = param;
                               paramLocal.color = document.getElementById("color").value;
                               setParams(paramLocal);
                           }}
                    />
                </div>
                <div style={styleOd}>
                    <div>
                        drive {/*Overdrive amount*/}
                    </div>
                    <input type={"range"}
                           min={minOd}
                           max={maxOd}
                           defaultValue={defaultOd}
                           id = {"drive"}
                           step={"0.1"}
                           onChange={()=>{
                               let paramLocal = param;
                               paramLocal.drive = document.getElementById("drive").value;
                               setParams(paramLocal);
                               console.log(param)
                           }}
                    />
                </div>
                <div style={styleOd}>
                    <div>
                        postcut {/*Post-distortion lowpass filter cutoff frequency.*/}
                    </div>
                    <input type={"range"}
                           min={minPostCut}
                           max={maxPostCut}
                           defaultValue={defaultPostCut}
                           id = {"postcut"}
                           onChange={()=>{
                               let paramLocal = param;
                               paramLocal.postcut = document.getElementById("postcut").value;
                               setParams(paramLocal);
                               console.log(param)
                           }}
                    />
                </div>
            </div>
        }

        if (effectId === 1) {
            let styleRever = {
                display:"inline-block",
                width:"33%"
            }
            let commonStyle = {
                border:"1px solid black",
                margin:"2%"
            }
            return  <div style={commonStyle}>
                <div>Reverberation Settings</div>
                <div style={styleRever}>
                    <div>
                        seconds {/*Impulse response length.*/}
                    </div>
                    <input type={"range"}
                           min={minSecondsRv}
                           max={maxSecondsRv}
                           step={"0.1"}
                           defaultValue={defaultSecondsRv}
                           id = {"seconds"}
                           onChange={()=>{
                               let paramLocal = param;
                               paramLocal.seconds = document.getElementById("seconds").value;
                               setParams(paramLocal);
                               console.log(param)
                           }}
                    />
                </div>
                <div style={styleRever}>
                    <div>
                        decay {/*Impulse response decay rate*/}
                    </div>
                    <input type={"range"}
                           min={minDecayRv}
                           max={maxDecayRv}
                           step={"0.1"}
                           defaultValue={defaultDecayRv}
                           id = {"decay"}
                           onChange={()=>{
                               let paramLocal = param;
                               paramLocal.decay = document.getElementById("decay").value;
                               setParams(paramLocal);
                           }}
                    />
                </div>
                <div style={styleRever}>
                    <div>
                        reverse {/*Reverse the impulse response.*/}
                    </div>
                    <input type={"checkbox"}
                           defaultValue={defaultOd}
                           id={"reverse"}
                           onChange={()=>{
                               let paramLocal = param;
                               paramLocal.reverse = document.getElementById("reverse").checked;
                               setParams(paramLocal);
                               console.log(param)
                           }}
                    />
                </div>
            </div>
        }
        return <div>Ввод дополнительных параметров не требуется</div>
    }
    let createEffect = (context)=>{
        if (effectId === 2){

            console.log("new effect")
            return new overdrive(context, param)
        }
        if (effectId === 1) {
            return new SimpleReverb(context, param)
        }
    }

    (()=>{
        let data = context.data;
        data.getNodeWithEffect = getNodeWithEffect;
        context.setData(data);
    })()
    document.addEventListener("fileLoaded", ()=>{
        setLoaded(true)
    })
    return <div>
            <div id={"effectSelector"}>
                <input type={"radio"} disabled={!isLoaded} name = "effect" value={"2"}
                       onChange={()=>{setEffectId(2)}}/> Овердрайв <br/>
                <input type={"radio"} disabled={!isLoaded} name = "effect" value={"1"}
                       onChange={()=>{setEffectId(1)}}/> Ревербация <br/>
                <input type={"radio"} disabled={!isLoaded} name = "effect" value={"0"}
                       onChange={()=>{setEffectId(0)}} /> Чистый звук <br/>
            </div>
        <div>
            {createHandler()}
        </div>
    </div>
}
export default EffectsPanel;
