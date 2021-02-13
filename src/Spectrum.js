import React, {useState, useContext, useEffect} from 'react'
import {UserContext} from "./Context";

let Spectrum = ()=>{
    let context = useContext(UserContext);

    let setAnalyserConnected = (sourceNode)=>{
        let canvas = document.getElementById("canvas");
        canvas.width = 400;
        canvas.height = 300;
        let ctx = canvas.getContext("2d");
        let analyser = context.data.audioCtx.createAnalyser();
        analyser.fftSize = 256;
        let  bufferLength = analyser.frequencyBinCount;
        console.log(bufferLength);
        let dataArray = new Uint8Array(bufferLength);
        let width = canvas.width;
        let height = canvas.height;
        let barWidth = (width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        function renderFrame() {
            requestAnimationFrame(renderFrame);
            x = 0;
            analyser.getByteFrequencyData(dataArray);
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, width, height);
            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i];
                let r = barHeight + (25 * (i/bufferLength));
                let g = 250 * (i/bufferLength);
                let b = 50;
                ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                ctx.fillRect(x, height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        }
        renderFrame();

        sourceNode.connect(analyser);
        return analyser;
    }



    (()=>{
        let data = context.data;
        data.getNodeWithAnalyser = setAnalyserConnected;
        context.setData(data);
    })()
    document.addEventListener('fileLoaded', ()=>{

        let canvas = document.getElementById("canvas");
        canvas.width = 400;
        canvas.height = 300;
        let ctx = canvas.getContext("2d");

    })
    return <div>
        <canvas id="canvas"/>
    </div>
}
export default Spectrum;
