'use strict';

document.addEventListener("DOMContentLoaded", init);

const canvas = document.querySelector('#canvas');
const mapCanvas = document.getElementById("canvasMap");
const resultCanvas = document.getElementById("canvasResult");


const ctx = canvas.getContext('2d');
const mapCtx = mapCanvas.getContext("2d");
const resultCtx = resultCanvas.getContext("2d");


//WHY 7?
const MAX_MOVEMENT = 7;


let imgOrg;
let imgMap;
let imageDataOrg;
let imgMapData;

let x;
let y;

let resultData = resultCtx.createImageData(canvas.width, canvas.height);


function init() {
    imgOrg = new Image();
    imgMap = new Image();
    imgOrg.onload = drawImgOrg;
    imgMap.onload = drawImgMap;
    imgOrg.src = 'cat.jpg';
    imgMap.src = "map.jpg";
    resultCanvas.addEventListener("mousemove", mouseMoved);
}

function drawImgOrg() {
    ctx.drawImage(imgOrg, 0, 0);
    resultCtx.drawImage(imgOrg, 0, 0);
    readImageDataOrg();
}

function drawImgMap() {
    mapCtx.drawImage(imgMap, 0, 0)
    // get the data of map image
    imgMapData = getImageData(mapCtx);
}

function readImageDataOrg() {
    let w = canvas.width;
    let h = canvas.height;
    imageDataOrg = ctx.getImageData(0, 0, w, h );
}

function getImageData(elem) {
    return elem.getImageData(0, 0, canvas.width, canvas.height);
}

function mouseMoved(event) {
    x = event.offsetX;
    y = event.offsety;
    // console.log(x,y);
    render();
}

function render() {
    copyPixels(x, y);
    drawCopiedData();
}


function calcXYRatio(x, y) {
    //  calculate and return x and y ratios (0 to 1) 
    // WHY FROM 0 TO 1 AND WHY WIDTH AND HEIGHT *2?

    let mouseXratio = ( x / canvas.width * 2 ) - 1;
    let mouseYratio = ( y / canvas.height * 2 ) - 1;
    return [mouseXratio, mouseYratio];
}




function drawCopiedData() {
    console.log(resultData)
    resultCtx.putImageData(resultData, 0, 0);
}


function copyPixels(mouseX, mouseY) {
    let [mouseXratio, mouseYratio]  = calcXYRatio(x, y);
    let displacementX = mouseXratio * MAX_MOVEMENT;
	let displacementY = mouseYratio * MAX_MOVEMENT;

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const pixelIndex = 4 * (x + y * canvas.width);

            const greyvalue = imgMapData.data[pixelIndex] / 255;

            const offsetX = Math.round( x + (displacementX * greyvalue));
            const offsetY = Math.round( y + (displacementY * greyvalue));
            
            let originalPixelIndex = (offsetY * canvas.width + offsetX) * 4;

            resultData.data[pixelIndex] = imageDataOrg.data[originalPixelIndex];
            resultData.data[pixelIndex + 1] = imageDataOrg.data[originalPixelIndex + 1];
            resultData.data[pixelIndex + 2] = imageDataOrg.data[originalPixelIndex + 2];
            resultData.data[pixelIndex + 3] = imageDataOrg.data[originalPixelIndex + 3];
        }
    }
}