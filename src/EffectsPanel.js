import React, {useContext, useState} from 'react'
import {UserContext} from "./Context";
import overdrive from "web-audio-components/overdrive";
import SimpleReverb from "web-audio-components/simple-reverb";

let EffectsPanel = ()=>{
    const context = useContext(UserContext);
    const [isLoaded, setLoaded] = useState(false);
    const [effectId, setEffectId] = useState(0);
    let getNodeWithEffect = (sourceNode)=>{
        if (effectId) {
            let effect = createEffect(context.data.audioCtx, effectId);
            sourceNode.connect(effect.input);
            return effect;
        }
        else
            return sourceNode;
    }
    let createEffect = (context)=>{
        if (effectId === 2){
            let param = {
                preBand: 1.0,
                color: 4000,
                drive: 0.8,
                postCut: 8000
            }
            return new overdrive(context, param)
        }
        if (effectId === 1) {
            let param = {
                seconds: 3,
                decay: 2,
                reverse: 1
            }
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
    </div>
}
export default EffectsPanel;
