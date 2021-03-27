import React, {useContext, useState} from 'react'
import {UserContext} from "./Context";
import ADSREnvelope from "adsr-envelope";
import SimpleReverb from "web-audio-components/simple-reverb";
import s from './styles/effectPanel.module.css'

const EffectsPanel = () => {


    const context = useContext(UserContext);
    const [isLoaded, setLoaded] = useState(false);
    const [effectId, setEffectId] = useState(0);
    const [param, setParams] = useState({});

    const duration = 100;

    const minGainAttack = 0;
    const maxGainAttac = duration;
    const defauldGainAttack = 25;

    const minDecay = 0;
    const maxDecay = duration;
    const defaultDecay = 25;

    const minSustain = 0.0;
    const maxSustain = 1.0;
    const defaultSustain = 0.5;

    const defaultRelease = 25;
    const minRelease = 0;
    const maxRelease = duration;


    const createEffect = (context) => {
        if (effectId === 2) {

            console.log(param);
            let adsr = new ADSREnvelope({
                duration: 15,
                attackTime: 5,
                decayTime: 5,
                sustainLevel: 0.5,
                releaseTime: 5,
                gateTime: 1,
                peakLevel: 1,
                epsilon: 0.001,
                attackCurve: "lin",
                decayCurve: "lin",
                releaseCurve: "lin",
            });
            for (const key in param) {
                adsr[key] = +param[key];
            }
            console.log(adsr);
            let gain = context.createGain();
            adsr.applyTo(gain.gain, context.currentTime);
            return gain;
        }
        if (effectId === 1) {
            return new SimpleReverb(context, {
                seconds: 3,
                decay: 2,
                reverse: 1
            })
        }
    };

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
                width: "20%"
            };

            return <div className={s['effects-regulation']}>
                <div className={s['effects-regulation__header']}>Envelope Settings</div>
                <div style={styleOd}>
                    <div>
                        Attack  {/*Attack is the time taken for initial run-up of level from nil to peak, beginning when the key is pressed.*/}
                    </div>
                    <input type={"range"}
                           min={minGainAttack}
                           max={maxGainAttac}
                           defaultValue={defauldGainAttack}
                           id={"Attack"}
                           step={"1"}
                           onChange={() => {
                               let paramLocal = param;
                               paramLocal.attackTime = document.getElementById("Attack").value;
                               setParams(paramLocal);
                               console.log(param)
                           }}
                    />
                </div>
                <div style={styleOd}>
                    <div>
                        Decay {/*Decay is the time taken for the subsequent run down from the attack level to the designated sustain leve.*/}
                    </div>
                    <input type={"range"}
                           min={minDecay}
                           max={maxDecay}
                           defaultValue={defaultDecay}
                           id={"decay"}
                           step={"1"}
                           onChange={() => {
                               let paramLocal = param;
                               paramLocal.decayTime = document.getElementById("decay").value;
                               setParams(paramLocal);
                               console.log(param);
                           }}
                    />
                </div>
                <div style={styleOd}>
                    <div>
                        Sustain {/*Sustain is the level during the main sequence of the sound's duration, until the key is released*/}
                    </div>
                    <input type={"range"}
                           min={minSustain}
                           max={maxSustain}
                           defaultValue={defaultSustain}
                           id={"sustain"}
                           step={"0.1"}
                           onChange={() => {
                               let paramLocal = param;
                               paramLocal.sustainLevel = document.getElementById("sustain").value;
                               setParams(paramLocal);
                               console.log(param)
                           }}
                    />
                </div>
                <div style={styleOd}>
                    <div>
                        Release {/*Release is the time taken for the level to decay from the sustain level to zero after the key is released.*/}
                    </div>
                    <input type={"range"}
                           min={minRelease}
                           max={maxRelease}
                           defaultValue={defaultRelease}
                           id={"release"}
                           step={"1"}
                           onChange={() => {
                               let paramLocal = param;
                               paramLocal.releaseTime = document.getElementById("release").value;
                               setParams(paramLocal);
                               console.log(param)
                           }}
                    />
                </div>
                <div style={styleOd}>
                    <div>
                        Duration {/*Release is the time taken for the level to decay from the sustain level to zero after the key is released.*/}
                    </div>
                    <input type={"range"}
                           min={"0"}
                           max={"100"}
                           defaultValue={duration}
                           id={"duration"}
                           step={"1"}
                           onChange={() => {
                               let paramLocal = param;
                               paramLocal.duration = document.getElementById("duration").value;
                               setParams(paramLocal);
                               console.log(param)
                           }}
                    />
                </div>
            </div>
        }

        if (effectId === 1) {
            return <div>Ввод дополнительных параметров не требуется</div>
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
        <div className={s.effects} id={"effectSelector"}>
            <div>Эффекты звука</div>
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
                   }}/> Без эффектов <br/>
        </div>
        <div>
            {createHandler()}
        </div>
    </div>
};
export default EffectsPanel;
