import React, {useContext} from 'react'
import {UserContext} from "./Context";
import s from './styles/equalizerPanel.module.css'

const EqualizerPanel = () => {

    const passGail = 0;
    const stopGail = -50;
    const defaultGain = 0;

    let Q = 1;
    let context = useContext(UserContext);
    let volumeControl = context.data.audioCtx.createGain();
    let borderArray = [];

    const bandwidthNumber = 8;
    const minFreq = 20;
    const maxFreq = 20000;
    const littleStep = 0.03;
    for (let i = 1; i < bandwidthNumber; i++)
        borderArray.push(((maxFreq - minFreq) / (Math.pow(2, i))));
    borderArray = borderArray.reverse();

    let bandwidthArray = [];
    bandwidthArray.push(
        {
            min: 0,
            max: borderArray[0]
        });
    for (let i = 1; i < bandwidthNumber; i++) {
        bandwidthArray[i] = {
            min: borderArray[i - 1],
            max: borderArray[i],
        };
        bandwidthArray[i].frequency = ((bandwidthArray[i].max + bandwidthArray[i].min) / 2);
        bandwidthArray[i].bandwindth = (bandwidthArray[i].max - bandwidthArray[i].min);
    }
    bandwidthArray[bandwidthArray.length - 1].max = maxFreq;

    bandwidthArray = bandwidthArray.map((value, index, array) => {
        if (value.max !== maxFreq)
            value.max = Math.round(value.max * (1 + littleStep));
        value.min = Math.round(value.min * (1 - littleStep));
        value.frequency = (value.max + value.min) / 2;
        value.bandwindth = (value.max - value.min) / 2;
        return value;
    });

    let filters = bandwidthArray.map((value, index) => {
        let filter = context.data.audioCtx.createBiquadFilter();
        filter.type = 'peaking'; // тип фильтра (узкополосный пиковый фильтр)
        filter.frequency.value = value.frequency;
        filter.Q.value = 5;
        filter.gain.value = defaultGain;
        return filter;
    });


    const getAllNode = () => {
        const getNodeWithEqualization = (sourceNode) => {

            volumeControl = context.data.audioCtx.createGain();
            volumeControl.gain.value = 1;
            const ringBuffer = new AudioWorkletNode(
                            context.data.audioCtx,
                            "ring-buffer-worklet-processor",
                            {
                                processorOptions: {
                                    kernelBufferSize: 16,
                                    channelCount: 2,
                                },
                            }
                        );
            sourceNode.connect(ringBuffer).connect(filters[0]);

            for (let i = 0; i < filters.length - 1; i++) {
                filters[i].connect(filters[i + 1]);
            }
            filters[filters.length - 1].connect(volumeControl);
            return volumeControl;
        }
        let data = context.data;
        data.getNodeWithEqualization = getNodeWithEqualization;
        context.setData(data)
    };
    getAllNode();


    let controlsArray = [];
    let debugOutput = () => {
        let filtersData = '';
        filters.forEach((value, index, array) => {
            filtersData += value.gain.value + " ";
        });
        console.log(filters);
    };
    const generateControls = () => {
        for (let i = 0; i < bandwidthNumber; i++) {
            let style = {
                transform: "rotate(-90deg)",
                display: "inline-block",
                marginTop: "5%",
                marginBottom: "5%"
            };
            let onChange = () => {
                if (filters)
                    filters = filters.map((value, index, array) => {
                        value.gain.value = document.getElementById("control_" + index).value;
                        debugOutput();
                        return value;
                    });
            };
            let control = <input
                min={stopGail}
                max={passGail}
                defaultValue={defaultGain}
                type={"range"}
                style={style}
                id={"control_" + i}
                onChange={onChange}

            />;
            controlsArray.push(control)
        }
    };

    generateControls();

    return <div className={s.contols}>
        {controlsArray}
        <br/>
        <div>
            <div>
                Volume (громокость)
            </div>
            <input min={0}
                   max={1}
                   step={0.01}
                   type={"range"}
                   id={"control_volume"}
                   onChange={() => {
                       volumeControl.gain.value = document.getElementById("control_volume").value;
                   }
                   }
                   defaultValue={1}
            />
        </div>
    </div>
}

export default EqualizerPanel;
