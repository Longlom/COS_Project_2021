import React, {useContext} from 'react'
import {UserContext} from "./Context";

let EqualizerPanel = ()=>{
    const bandwidthNumber = 10;
    const minFreq = 20;
    const maxFreq = 20000;
    const crossingPart = 0.05;
    const passGail = -3;
    const stopGail = -70;
    let context = useContext(UserContext);
    let arrayOfBounds = [];
    for (let i = 1; i< bandwidthNumber; i++)
        arrayOfBounds.push(((maxFreq-minFreq)/(Math.pow(2, i))));
    arrayOfBounds = arrayOfBounds.reverse();
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

    let filtersArray = arrayOfBandwidthes.map((value, index, array)=>{
        let filter = context.data.audioCtx.createBiquadFilter();
        filter.frequency.value = value.frequency;
        filter.Q.value = 1;
        filter.gain.value = -3;
        filter.type = "peaking";
        return filter;
    })


    let filters = filtersArray.reduce((prev, curr)=>{
        prev.connect(curr);
        return curr;
    });
    (()=>{
        let data = context.data;
        let getNodeWithEqualization = (sourceNode)=>{
            sourceNode.connect(filters);
            return filters;
        }
        data.getNodeWithEqualization = getNodeWithEqualization;
        context.setData(data)
    })()
    let arrayOfControls = [];
    let generateControls = ()=>{
        for (let i =0; i< bandwidthNumber; i++){
            let style = {
                "transform": "rotate(-90deg)",
                display:"inline-block",
                marginTop:"5%",
                marginBottom:"5%"
            }
            let onChange = ()=>{
                filtersArray[i].gain.value = Math.floor(document.getElementById("control_"+i).value);
                console.log(filtersArray)
            }
            let control = <input min={stopGail} max={passGail} type={"range"} style={style}
                                 id={"control_"+i} onChange={onChange} step={1}/>
            arrayOfControls.push(control)
        }
    }
    generateControls();
    return <div>
        {arrayOfControls}
    </div>
}

export default EqualizerPanel
