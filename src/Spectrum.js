import React, {useState, useContext, useEffect} from 'react'
import {UserContext} from "./Context";

let Spectrum = ()=>{
    let context = useContext(UserContext);
    const [link, setLink] = useState(<div/>);
    let experimentalOutputtoFile = (str)=>{
        let href = "data:text/plain;charset=utf-8,%EF%BB%BF"+ encodeURIComponent(str);
      let s =
          <div>
              <br/>
              <a href= {href}
                 download="text.txt">
                 text.txt
              </a>
          </div>
        setLink(s);
    }

    let arrayOfExperimentalData = [];
    let writeExperimental = ()=>{
        let writeString = "";
        for (let i in arrayOfExperimentalData)
           for (let j in i)
               writeString+=Object.values(j)[0] + "\t";
           writeString +="\n";
        experimentalOutputtoFile(writeString);
    }
    let writen = false;
    let fillExperimentalArray = (array)=>{
        let limit = 300;
        if (arrayOfExperimentalData.length<limit)
            arrayOfExperimentalData.push(array);
        else {
            if (!writen)
            {
                writeExperimental();
                alert(1);
                writen=1;
            }
        }
    }
    let setAnalyserConnected = (sourceNode)=>{
        let canvas = document.getElementById("canvas");
        canvas.width = window.innerWidth*0.8;
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
            console.log(dataArray);
            fillExperimentalArray(dataArray);
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, width, height);
            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i];
                let r = barHeight/height*(255);
                let g = 0;
                let b = 0;
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
    })();
    /*EXPERIMENTAL*/

    return <div>
        <canvas id="canvas"/>
        {link}
    </div>
}
export default Spectrum;
