import React, {useContext} from 'react'
import {UserContext} from "./Context";
import overdrive from "web-audio-components/overdrive";
import SimpleReverb from "web-audio-components/simple-reverb";

let EffectsPanel = ()=>{
    const context = useContext(UserContext);
    let effectId = 0;
    let setEffectIdToContext = (id)=>{
        let data = context.data;
        data.effectId = id;
        context.setData(data);
    }
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
    setEffectIdToContext(0);
    return <div>
            <div id={"effectSelector"}>
                <input type={"radio"} id = "over" name = "effect" value={"2"}
                       onChange={()=>{effectId=2;}}/> Овердрайв <br/>
                <input type={"radio"} id = "reverb" name = "effect" value={"1"}
                       onChange={()=>{effectId=1;}}/> Ревербация <br/>
                <input type={"radio"} id = "clr" name = "effect" value={"0"}
                       onChange={()=>{effectId=0;}}/> Чистый звук <br/>
            </div>
    </div>
}
export default EffectsPanel;
