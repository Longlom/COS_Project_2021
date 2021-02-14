import React, {useContext, useState} from 'react'
import {UserContext} from "./Context";

let EqualizerPanel = ()=>{
    const bandwidthNumber = 10;
    const minFreq = 20;
    const maxFreq = 20000;
    const crossingPart = 0.05;
    const passGail =  -3;
    const stopGail = -70;
    const defaultGain = -3;
    let Q = 1;
    let context = useContext(UserContext);
    let volumeControl = context.data.audioCtx.createGain();
    let arrayOfBounds = [];
    for (let i = 1; i< bandwidthNumber; i++)
        arrayOfBounds.push(((maxFreq-minFreq)/(Math.pow(2, i))));
    arrayOfBounds = arrayOfBounds.reverse();

   // arrayOfBounds = [2000, 4000, 6000, 8000, 10000, 12000,14000,16000,18000]
    let arrayOfBandwidthes=[];
    arrayOfBandwidthes.push({min:0, max:arrayOfBounds[0]});
    for (let i =1; i< bandwidthNumber; i++){
        arrayOfBandwidthes[i] = {
            min:arrayOfBounds[i-1],
            max:arrayOfBounds[i],
        };
        arrayOfBandwidthes[i].frequency = (arrayOfBandwidthes[i].max +arrayOfBandwidthes[i].min)/2;
        arrayOfBandwidthes[i].bandwindth = (arrayOfBandwidthes[i].max -arrayOfBandwidthes[i].min);
    }
    arrayOfBandwidthes[arrayOfBandwidthes.length-1].max = maxFreq;

    arrayOfBandwidthes = arrayOfBandwidthes.map((value, index, array)=>{
        if (value.max !== maxFreq)
            value.max = Math.round(value.max*(1+crossingPart));
        value.min = Math.round(value.min*(1-crossingPart));
        value.frequency = (value.max + value.min)/2;
        value.bandwindth = (value.max - value.min)/2;
        return value;
    })

    let setQ = ()=>{
        Q = document.getElementById("control_q").value;
        console.log(filters)
        if (filters)
            filters = filters.map((value, index, array)=>{
                value.Q.value = Q;
                return value;
            })
    }
    let filters = arrayOfBandwidthes.map((value, index, array)=>{
        let filter = context.data.audioCtx.createBiquadFilter();
        filter.type = 'peaking'; // тип фильтра
        filter.frequency.value = value.frequency; // частота
        filter.Q.value = Q; // Q-factor
        filter.gain.value = defaultGain;
        return filter;
    });


    let setNodeGetter = ()=>{

        let getNodeWithEqualization = (sourceNode)=>{
            volumeControl = context.data.audioCtx.createGain();
            volumeControl.gain.value = 1;
            sourceNode.connect(filters[0]);
            for (let i =0; i<filters.length-1; i++)
                filters[i].connect(filters[i+1]);
            filters[filters.length-1].connect(volumeControl);

            return volumeControl;
        }
        let data = context.data;
        data.getNodeWithEqualization = getNodeWithEqualization;
        context.setData(data)
    };
    setNodeGetter();
    let arrayOfControls = [];
    let debugOutput = ()=>{
        let filtersData = '';
        filters.forEach((value, index, array)=>{
            filtersData+=value.gain.value+" ";
        })
        console.log(filtersData);
    }
    let generateControls = ()=>{
        for (let i =0; i< bandwidthNumber; i++){
            let style = {
                "transform": "rotate(-90deg)",
                display:"inline-block",
                marginTop:"5%",
                marginBottom:"5%"
            }
            let onChange = ()=>{

                if (filters)
                    filters = filters.map((value, index, array)=>{
                        value.gain.value = document.getElementById("control_"+index).value;
                        debugOutput();
                        return value;
                     });


            }
            let control = <input
                min={stopGail}
                max={passGail}
                defaultValue={defaultGain}
                type={"range"}
                style={style}
                id={"control_"+i}
                onChange={onChange}

            />
            arrayOfControls.push(control)
        }
    }
    generateControls();
    return <div>
        {arrayOfControls}
        <br/>
        <div>
            <div>
                Q handler
            </div>
            <input min={1} max={100} type={"range"}
                   id={"control_q"} onChange={()=>{setQ()}}
                   defaultValue={1}
            />
        </div><br/>
        <div>
            <div>
                volume handler
            </div>
            <input min={0}
                   max={1}
                   step={0.01}
                   type={"range"}
                   id={"control_volume"}
                   onChange={()=>{
                      volumeControl.gain.value = document.getElementById("control_volume").value;
                        }
                   }
                   defaultValue={1}
            />
        </div>
    </div>
}

export default EqualizerPanel
