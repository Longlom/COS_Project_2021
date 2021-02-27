import React, {useContext, useState} from 'react'
import {UserContext} from "./Context";
import overdrive from "web-audio-components/overdrive";
import ADSREnvelope from "adsr-envelope";
import SimpleReverb from "web-audio-components/simple-reverb";

const EffectsPanel = () => {
    const createEffect = (context) => {
        if (effectId === 2) {

            console.log("new effect");
            // return new overdrive(context, param)
            console.log(param);
            let adsr = new ADSREnvelope({
                attackTime: 0.01,
                decayTime: 0.3,
                sustainLevel: 0.5,
                releaseTime: 10,
                gateTime: 1,
                peakLevel: 1,
                epsilon: 0.001,
                attackCurve: "lin",
                decayCurve: "lin",
                releaseCurve: "lin"
            });
            console.log(context);
            let gain = context.createGain();
            adsr.applyTo(gain.gain, context.currentTime);
return gain;
        }
        if (effectId === 1) {
            return new SimpleReverb(context, param)
        }
    };

    const context = useContext(UserContext);
    const [isLoaded, setLoaded] = useState(false);
    const [effectId, setEffectId] = useState(0);
    const [param, setParams] = useState({});
    const duration = 20;
    const minGainAttack = -duration;
    const maxGainAttac = duration;
    const defauldGainAttack = 5;
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
    const getNodeWithEffect = (sourceNode) => {
        if (effectId) {
            let effect = createEffect(context.data.audioCtx, effectId);
            console.log(effect);
            if (effectId === 2) {
                sourceNode.connect(effect);
            } else {
                sourceNode.connect(effect.input);
            }
            return effect;
        } else
            return sourceNode;
    };
    const createHandler = () => {
        if (effectId === 2) {
            let styleOd = {
                display: "inline-block",
                width: "25%"
            };
            let commonStyle = {
                border: "1px solid black",
                margin: "2%"
            };
            return <div style={commonStyle}>
                <div>Envelope Settings</div>
                <div style={styleOd}>
                    <div>
                        Attack  {/*Pre-distortion bandpass filter wet gain coefficient.*/}
                    </div>
                    <input type={"range"}
                           min={minGainAttack}
                           max={maxGainAttac}
                           defaultValue={defauldGainAttack}
                           id={"Attack"}
                           onChange={() => {
                               let paramLocal = param;
                               paramLocal.preBand = document.getElementById("Attack").value;
                               setParams(paramLocal);
                               console.log(param)
                           }}
                    />
                </div>
                <div style={styleOd}>
                    <div>
                        Decay {/*Pre-distortion bandpass filter frequency.*/}
                    </div>
                    <input type={"range"}
                           min={minColor}
                           max={maxColor}
                           defaultValue={defaultColor}
                           id={"color"}
                           onChange={() => {
                               let paramLocal = param;
                               paramLocal.color = document.getElementById("color").value;
                               setParams(paramLocal);
                           }}
                    />
                </div>
                <div style={styleOd}>
                    <div>
                        Sustain {/*Overdrive amount*/}
                    </div>
                    <input type={"range"}
                           min={minOd}
                           max={maxOd}
                           defaultValue={defaultOd}
                           id={"drive"}
                           step={"0.1"}
                           onChange={() => {
                               let paramLocal = param;
                               paramLocal.drive = document.getElementById("drive").value;
                               setParams(paramLocal);
                               console.log(param)
                           }}
                    />
                </div>
                <div style={styleOd}>
                    <div>
                        Release {/*Post-distortion lowpass filter cutoff frequency.*/}
                    </div>
                    <input type={"range"}
                           min={minPostCut}
                           max={maxPostCut}
                           defaultValue={defaultPostCut}
                           id={"postcut"}
                           onChange={() => {
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
                display: "inline-block",
                width: "33%"
            };
            let commonStyle = {
                border: "1px solid black",
                margin: "2%"
            };
            return <div style={commonStyle}>
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
                           id={"seconds"}
                           onChange={() => {
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
                           id={"decay"}
                           onChange={() => {
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
                           onChange={() => {
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
    };


    (() => {
        let data = context.data;
        data.getNodeWithEffect = getNodeWithEffect;
        context.setData(data);
    })();

    document.addEventListener("fileLoaded", () => {
        setLoaded(true)
    });

    return <div>
        <div id={"effectSelector"}>
            <input type={"radio"} disabled={!isLoaded} name="effect" value={"2"}
                   onChange={() => {
                       setEffectId(2)
                   }}/> Енвелоп <br/>
            <input type={"radio"} disabled={!isLoaded} name="effect" value={"1"}
                   onChange={() => {
                       setEffectId(1)
                   }}/> Ревербация <br/>
            <input type={"radio"} disabled={!isLoaded} name="effect" value={"0"}
                   onChange={() => {
                       setEffectId(0)
                   }}/> Чистый звук <br/>
        </div>
        <div>
            {createHandler()}
        </div>
    </div>
};
export default EffectsPanel;
