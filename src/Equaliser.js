import React, {useState, useContext} from 'react'
import {UserContext} from "./Context";

const Equaliser = () => {
    let context = useContext(UserContext);
    const [link, setLink] = useState(<div/>);
    let experimentalOutputtoFile = (str) => {
        let href = "data:text/plain;charset=utf-8,%EF%BB%BF" + encodeURIComponent(str);
        let s =
            <div>
                <br/>
                <a href={href}
                   download="text.txt">
                    text.txt
                </a>
            </div>
        setLink(s);
    };

    const fillExperimentalArray = (array) => {
        let limit = 300;
        if (arrayOfExperimentalData.length < limit)
            arrayOfExperimentalData.push(JSON.parse(JSON.stringify(array)));
        else {
            if (!writen) {
                writeExperimental();
                writen = 1;
                console.log(arrayOfExperimentalData)
            }
        }
    };

    const setAnalyserConnected = (sourceNode) => {
        let canvas = document.getElementById("canvas");
        canvas.width = window.innerWidth * 0.8;
        canvas.height = 300;
        let ctx = canvas.getContext("2d");
        let analyser = context.data.audioCtx.createAnalyser();
        analyser.fftSize = 4096;
        let bufferLength = analyser.frequencyBinCount;
        console.log(bufferLength);
        let dataArray = new Uint8Array(bufferLength);

        let width = canvas.width;
        let height = canvas.height;
        let barWidth = (width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        (function renderFrame() {
            requestAnimationFrame(renderFrame);
            x = 0;
            analyser.getByteFrequencyData(dataArray);
            fillExperimentalArray(dataArray);
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, width, height);
            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i];
                let r =0;
                let g = barHeight/height * 255;
                let b = 0;
                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.fillRect(x, height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        })();
        sourceNode.connect(analyser);
        return analyser;
    };

    const writeExperimental = () => {
        let writeString = "";
        writeString = JSON.stringify(arrayOfExperimentalData).replace(/(\[\{)|(\}\])/g, "")
            .replace(/\}\,\{/g, "\n").replace(/\,/g, "")
            .replace(/\"\d+":/g, "\t");
        experimentalOutputtoFile(writeString);
    };

    let arrayOfExperimentalData = [];
    let writen = false;


    (() => {
        let data = context.data;
        data.getNodeWithAnalyser = setAnalyserConnected;
        context.setData(data);
    })();

    return <div>
        <canvas id="canvas"/>
        {link}
    </div>
};



export default Equaliser;
