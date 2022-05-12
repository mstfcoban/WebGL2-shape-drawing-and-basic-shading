"use strict";

let program;

let positions = [];
let positionsEyeRight = [];
let positionsEyeLeft = [];
let positionsMask = [];
let positionsMask1 = [];
let positionsMask2 = [];
let positionsMask3 = [];
let positionsMask4 = [];
let positionsMask5 = [];

let buffer;
let bufferEyeRight;
let bufferEyeLeft;
let bufferMask;
let bufferMask1;
let bufferMask2;
let bufferMask3;
let bufferMask4;
let bufferMask5;

let gl = null;
let canvas = null;
let offsetLoc;

let currentRotation = [0, 1];
let currentAngle;
let uRotationVector;
let previousTime = 0.0;
let degreesPerSecond = 50.0;

const bodyelement = document.querySelector("body");
bodyelement.addEventListener("keydown", Keydown,false);
function Keydown(event){
    if("1" == event.key){
        step2();
        step1();
    }
    else if("2" == event.key){
        step2();
    }
    else if("3" == event.key){
        step3();
    }
}

step1();
function step1(){
    canvas = document.querySelector("#glCanvas");
    gl = canvas.getContext("webgl");

    if(!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    //creat program for face
    program = initShaderProgram(gl, vsSourceStop, fsSource);
    //face
    for(var i = 0; i<72 ;i++){
        positions.push(0.0);
        positions.push(0.0);
        positions.push(Math.cos((Math.PI/36)*i)/3);
        positions.push(Math.sin((Math.PI/36)*i)/3);
        positions.push(Math.cos((Math.PI/36)*(i+1))/3);
        positions.push(Math.sin((Math.PI/36)*(i+1))/3);
    }
    buffer = initBuffer(gl, positions);

    //eyes
    for(var i = 0; i<72;i++){
        // right eye
        positionsEyeRight.push((0.0)+0.14);
        positionsEyeRight.push((0.0)+0.14);
        positionsEyeRight.push(Math.cos((Math.PI/36)*i)/12+0.14);
        positionsEyeRight.push(Math.sin((Math.PI/36)*i)/12+0.14);
        positionsEyeRight.push( Math.cos((Math.PI/36)*(i+1))/12+0.14);
        positionsEyeRight.push(Math.sin((Math.PI/36)*(i+1))/12+0.14);
        // left eye
        positionsEyeLeft.push((0.0)-0.14);
        positionsEyeLeft.push((0.0)+0.14);
        positionsEyeLeft.push(Math.cos((Math.PI/36)*i)/12-0.14);
        positionsEyeLeft.push(Math.sin((Math.PI/36)*i)/12+0.14);
        positionsEyeLeft.push( Math.cos((Math.PI/36)*(i+1))/12-0.14);
        positionsEyeLeft.push(Math.sin((Math.PI/36)*(i+1))/12+0.14);
    }
    //right eye
    bufferEyeRight = initBuffer(gl, positionsEyeRight);
    // left eye
    bufferEyeLeft = initBuffer(gl, positionsEyeLeft);
    offsetLoc = gl.getUniformLocation(program, "u_offset");

    //creat program for mask
    positionsMask = [ -0.2, 0.0, 0.2, 0.0, -0.2, -0.2, 0.2, -0.2];
    bufferMask = initBuffer(gl, positionsMask);

    for(var t = -0.6; t<0.6; t+=0.01){
        var Qx = t;
        var Qy = (-5/9)*t*t + 0.2;
        positionsMask1.push(0.2);
        positionsMask1.push(0.0);
        positionsMask1.push(Qx/3);
        positionsMask1.push(Qy/3);
        positionsMask1.push(-0.2);
        positionsMask1.push(0.0);

        var Qxx = t;
        var Qyy = (5/9)*t*t - 0.8;
        positionsMask1.push(-0.2);
        positionsMask1.push(-0.2);
        positionsMask1.push(Qxx/3);
        positionsMask1.push(Qyy/3);
        positionsMask1.push(0.2);
        positionsMask1.push(-0.2);
    }
    bufferMask1 = initBuffer(gl, positionsMask1); // up and down of mask

    positionsMask2 = [  0.2, 0.0, 0.33, 0.05, 0.2, -0.03, 0.333, 0.0233,];
    bufferMask2 = initBuffer(gl, positionsMask2);   // sağ ip

    positionsMask3 = [  -0.2, 0.0, -0.33, 0.05, -0.2, -0.03, -0.333, 0.0233,];
    bufferMask3 = initBuffer(gl, positionsMask3); // sol ip

    positionsMask4 = [  0.2, -0.17, 0.263, -0.2043,  0.2, -0.2,  0.2466, -0.2246];
    bufferMask4 = initBuffer(gl, positionsMask4);
    
    positionsMask5 = [  -0.2, -0.17, -0.263, -0.2043, -0.2, -0.2, -0.2466, -0.2246];
    bufferMask5 = initBuffer(gl, positionsMask5);

    gl.viewport(0, 0, glCanvas.width, glCanvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    //face
    gl.uniform4fv(offsetLoc, [0.929, 0.831, 0.090, 1.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3*72);
    //rightEye
    gl.uniform4fv(offsetLoc, [0.31, 0.211, 0.078, 1.0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferEyeRight.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3*72);
    //leftEye
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferEyeLeft.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3*72);
    //mask
    gl.uniform4fv(offsetLoc, [0.839, 0.878, 0.921, 1.0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask1.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"),  2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3*120);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask1.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"),  2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3*120*2);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask2.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask3.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask4.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask5.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function step2() {
    canvas = document.querySelector("#glCanvas");
    gl = canvas.getContext("webgl");

    if(!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    //creat program for face
    program = initShaderProgram(gl, vsSource, fsSource);
    //face
    for(var i = 0; i<72 ;i++){
        positions.push(0.0);
        positions.push(0.0);
        positions.push(Math.cos((Math.PI/36)*i)/3);
        positions.push(Math.sin((Math.PI/36)*i)/3);
        positions.push(Math.cos((Math.PI/36)*(i+1))/3);
        positions.push(Math.sin((Math.PI/36)*(i+1))/3);
    }
    buffer = initBuffer(gl, positions);

    //eyes
    for(var i = 0; i<72;i++){
        // right eye
        positionsEyeRight.push((0.0)+0.14);
        positionsEyeRight.push((0.0)+0.14);
        positionsEyeRight.push(Math.cos((Math.PI/36)*i)/12+0.14);
        positionsEyeRight.push(Math.sin((Math.PI/36)*i)/12+0.14);
        positionsEyeRight.push( Math.cos((Math.PI/36)*(i+1))/12+0.14);
        positionsEyeRight.push(Math.sin((Math.PI/36)*(i+1))/12+0.14);
        // left eye
        positionsEyeLeft.push((0.0)-0.14);
        positionsEyeLeft.push((0.0)+0.14);
        positionsEyeLeft.push(Math.cos((Math.PI/36)*i)/12-0.14);
        positionsEyeLeft.push(Math.sin((Math.PI/36)*i)/12+0.14);
        positionsEyeLeft.push( Math.cos((Math.PI/36)*(i+1))/12-0.14);
        positionsEyeLeft.push(Math.sin((Math.PI/36)*(i+1))/12+0.14);
    }
    //right eye
    bufferEyeRight = initBuffer(gl, positionsEyeRight);
    // left eye
    bufferEyeLeft = initBuffer(gl, positionsEyeLeft);
    offsetLoc = gl.getUniformLocation(program, "u_offset");

    //mask
    positionsMask = [ -0.2, 0.0, 0.2, 0.0, -0.2, -0.2, 0.2, -0.2];
    bufferMask = initBuffer(gl, positionsMask);

    for(var t = -0.6; t<0.6; t+=0.01){
        var Qx = t;
        var Qy = (-5/9)*t*t + 0.2;
        positionsMask1.push(0.2);
        positionsMask1.push(0.0);
        positionsMask1.push(Qx/3);
        positionsMask1.push(Qy/3);
        positionsMask1.push(-0.2);
        positionsMask1.push(0.0);

        var Qxx = t;
        var Qyy = (5/9)*t*t - 0.8;
        positionsMask1.push(-0.2);
        positionsMask1.push(-0.2);
        positionsMask1.push(Qxx/3);
        positionsMask1.push(Qyy/3);
        positionsMask1.push(0.2);
        positionsMask1.push(-0.2);
    }
    bufferMask1 = initBuffer(gl, positionsMask1); // up and down of mask

    positionsMask2 = [  0.2, 0.0, 0.33, 0.05, 0.2, -0.03, 0.333, 0.0233,];
    bufferMask2 = initBuffer(gl, positionsMask2);   // sağ ip

    positionsMask3 = [  -0.2, 0.0, -0.33, 0.05, -0.2, -0.03, -0.333, 0.0233,];
    bufferMask3 = initBuffer(gl, positionsMask3); // sol ip

    positionsMask4 = [  0.2, -0.17, 0.263, -0.2043,  0.2, -0.2,  0.2466, -0.2246];
    bufferMask4 = initBuffer(gl, positionsMask4);
    
    positionsMask5 = [  -0.2, -0.17, -0.263, -0.2043, -0.2, -0.2, -0.2466, -0.2246];
    bufferMask5 = initBuffer(gl, positionsMask5);

    currentAngle = 0.0;
    animateScene();
}

function animateScene(){
    gl.viewport(0, 0, glCanvas.width, glCanvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let radians = -currentAngle * Math.PI / 180.0;
    currentRotation[0] = Math.sin(radians);
    currentRotation[1] = Math.cos(radians);

    uRotationVector = gl.getUniformLocation(program, "uRotationVector");
    gl.uniform2fv(uRotationVector, currentRotation);

    gl.useProgram(program);

    //face
    gl.uniform4fv(offsetLoc, [0.929, 0.831, 0.090, 1.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3*72);
    //rightEye
    gl.uniform4fv(offsetLoc, [0.31, 0.211, 0.078, 1.0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferEyeRight.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3*72);
    //leftEye
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferEyeLeft.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3*72);
    //mask
    gl.uniform4fv(offsetLoc, [0.839, 0.878, 0.921, 1.0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask1.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"),  2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3*120);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask1.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"),  2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3*120*2);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask2.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask3.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask4.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask5.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    window.requestAnimationFrame(function(currentTime) {
        let deltaAngle = ((currentTime - previousTime) / 1000.0) * degreesPerSecond;
        currentAngle = (currentAngle + deltaAngle) % 360;
        previousTime = currentTime;
        if(currentAngle>45){
            currentAngle=315;
            animateScene2();
        }
        else{
            animateScene();    
        }
    }
    );
}

function animateScene2(){
    gl.viewport(0, 0, glCanvas.width, glCanvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let radians = currentAngle * Math.PI / 180.0;
    currentRotation[0] = Math.sin(radians);
    currentRotation[1] = Math.cos(radians);

    uRotationVector = gl.getUniformLocation(program, "uRotationVector");
    gl.uniform2fv(uRotationVector, currentRotation);

    gl.useProgram(program);

    //face
    gl.uniform4fv(offsetLoc, [0.929, 0.831, 0.090, 1.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3*72);
    //rightEye
    gl.uniform4fv(offsetLoc, [0.31, 0.211, 0.078, 1.0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferEyeRight.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3*72);
    //leftEye
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferEyeLeft.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3*72);
    //mask
    gl.uniform4fv(offsetLoc, [0.839, 0.878, 0.921, 1.0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask1.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"),  2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3*120);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask1.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"),  2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3*120*2);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask2.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask3.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask4.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask5.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    window.requestAnimationFrame(function(currentTime) {
        let deltaAngle = ((currentTime - previousTime) / 1000.0) * degreesPerSecond;
        currentAngle = (currentAngle + deltaAngle) % 360;
        previousTime = currentTime;
        console.log(currentAngle);
        if(currentAngle<45 && currentAngle >43){
            currentAngle = -45;
            animateScene();
        }
        else{
            animateScene2();    
        }
    }
    );
}

function step3() {
    canvas = document.querySelector("#glCanvas");
    gl = canvas.getContext("webgl");

    if(!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    //creat program for face
    program = initShaderProgram(gl, vsSource, fsSource);
    //face
    for(var i = 0; i<72 ;i++){
        positions.push(0.0);
        positions.push(0.0);
        positions.push(Math.cos((Math.PI/36)*i)/3);
        positions.push(Math.sin((Math.PI/36)*i)/3);
        positions.push(Math.cos((Math.PI/36)*(i+1))/3);
        positions.push(Math.sin((Math.PI/36)*(i+1))/3);
    }
    buffer = initBuffer(gl, positions);

    //eyes
    for(var i = 0; i<72;i++){
        // right eye
        positionsEyeRight.push((0.0)+0.14);
        positionsEyeRight.push((0.0)+0.14);
        positionsEyeRight.push(Math.cos((Math.PI/36)*i)/12+0.14);
        positionsEyeRight.push(Math.sin((Math.PI/36)*i)/12+0.14);
        positionsEyeRight.push( Math.cos((Math.PI/36)*(i+1))/12+0.14);
        positionsEyeRight.push(Math.sin((Math.PI/36)*(i+1))/12+0.14);
        // left eye
        positionsEyeLeft.push((0.0)-0.14);
        positionsEyeLeft.push((0.0)+0.14);
        positionsEyeLeft.push(Math.cos((Math.PI/36)*i)/12-0.14);
        positionsEyeLeft.push(Math.sin((Math.PI/36)*i)/12+0.14);
        positionsEyeLeft.push( Math.cos((Math.PI/36)*(i+1))/12-0.14);
        positionsEyeLeft.push(Math.sin((Math.PI/36)*(i+1))/12+0.14);
    }
    //right eye
    bufferEyeRight = initBuffer(gl, positionsEyeRight);
    // left eye
    bufferEyeLeft = initBuffer(gl, positionsEyeLeft);
    offsetLoc = gl.getUniformLocation(program, "u_offset");

    //mask
    positionsMask = [ -0.2, 0.0, 0.2, 0.0, -0.2, -0.2, 0.2, -0.2];
    bufferMask = initBuffer(gl, positionsMask);

    for(var t = -0.6; t<0.6; t+=0.01){
        var Qx = t;
        var Qy = (-5/9)*t*t + 0.2;
        positionsMask1.push(0.2);
        positionsMask1.push(0.0);
        positionsMask1.push(Qx/3);
        positionsMask1.push(Qy/3);
        positionsMask1.push(-0.2);
        positionsMask1.push(0.0);

        var Qxx = t;
        var Qyy = (5/9)*t*t - 0.8;
        positionsMask1.push(-0.2);
        positionsMask1.push(-0.2);
        positionsMask1.push(Qxx/3);
        positionsMask1.push(Qyy/3);
        positionsMask1.push(0.2);
        positionsMask1.push(-0.2);
    }
    bufferMask1 = initBuffer(gl, positionsMask1); // up and down of mask

    positionsMask2 = [  0.2, 0.0, 0.33, 0.05, 0.2, -0.03, 0.333, 0.0233,];
    bufferMask2 = initBuffer(gl, positionsMask2);   // sağ ip

    positionsMask3 = [  -0.2, 0.0, -0.33, 0.05, -0.2, -0.03, -0.333, 0.0233,];
    bufferMask3 = initBuffer(gl, positionsMask3); // sol ip

    positionsMask4 = [  0.2, -0.17, 0.263, -0.2043,  0.2, -0.2,  0.2466, -0.2246];
    bufferMask4 = initBuffer(gl, positionsMask4);
    
    positionsMask5 = [  -0.2, -0.17, -0.263, -0.2043, -0.2, -0.2, -0.2466, -0.2246];
    bufferMask5 = initBuffer(gl, positionsMask5);

    currentAngle = 0.0;
    animateScene3();
}

function animateScene3(){
    gl.viewport(0, 0, glCanvas.width, glCanvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let radians = -currentAngle * Math.PI / 180.0;
    currentRotation[0] = Math.sin(radians);
    currentRotation[1] = Math.cos(radians);

    uRotationVector = gl.getUniformLocation(program, "uRotationVector");
    gl.uniform2fv(uRotationVector, currentRotation);

    gl.useProgram(program);

    //face
    if(currentAngle < -40 && currentAngle >= -45){
        gl.uniform4fv(offsetLoc, [0.900, 0.650, 0.090, 1.0]);
    }
    else if(currentAngle < -35 && currentAngle >= -40){
        gl.uniform4fv(offsetLoc, [0.900, 0.660, 0.090, 1.0]); 
    }
    else if(currentAngle < -30 && currentAngle >= -35){
        gl.uniform4fv(offsetLoc, [0.900, 0.678, 0.090, 1.0]); 
    }
    else if(currentAngle < -25 && currentAngle >= -30){
        gl.uniform4fv(offsetLoc, [0.900, 0.696, 0.090, 1.0]); 
    }
    else if(currentAngle < -20 && currentAngle >= -25){
        gl.uniform4fv(offsetLoc, [0.900, 0.716, 0.090, 1.0]); 
    }
    else if(currentAngle < -15 && currentAngle >= -20){
        gl.uniform4fv(offsetLoc, [0.900, 0.732, 0.090, 1.0]); 
    }
    else if(currentAngle < -10 && currentAngle >= -15){
        gl.uniform4fv(offsetLoc, [0.900, 0.750, 0.090, 1.0]); 
    }
    else if (currentAngle < 10 && currentAngle >= -10){
        gl.uniform4fv(offsetLoc, [0.900, 0.830, 0.090, 1.0]); 
    }
    else if(currentAngle < 15 && currentAngle > 10){
        gl.uniform4fv(offsetLoc, [0.900, 0.750, 0.090, 1.0]); 
    }
    else if(currentAngle < 20 && currentAngle > 15){
        gl.uniform4fv(offsetLoc, [0.900, 0.732, 0.090, 1.0]); 
    }
    else if(currentAngle < 25 && currentAngle > 20){
        gl.uniform4fv(offsetLoc, [0.900, 0.716, 0.090, 1.0]); 
    }
    else if(currentAngle < 30 && currentAngle > 25){
        gl.uniform4fv(offsetLoc, [0.900, 0.696, 0.090, 1.0]);  
    }
    else if(currentAngle < 35 && currentAngle > 30){
        gl.uniform4fv(offsetLoc, [0.900, 0.678, 0.090, 1.0]); 
    }
    else if(currentAngle < 40 && currentAngle > 35){
        gl.uniform4fv(offsetLoc, [0.900, 0.660, 0.090, 1.0]);
    }
    else{
        gl.uniform4fv(offsetLoc, [0.900, 0.650, 0.090, 1.0]);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3*72);
    //rightEye
    gl.uniform4fv(offsetLoc, [0.31, 0.211, 0.078, 1.0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferEyeRight.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3*72);
    //leftEye
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferEyeLeft.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3*72);
    //mask
    gl.uniform4fv(offsetLoc, [0.839, 0.878, 0.921, 1.0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask1.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"),  2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3*120);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask1.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"),  2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3*120*2);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask2.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask3.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask4.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask5.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    window.requestAnimationFrame(function(currentTime) {
        let deltaAngle = ((currentTime - previousTime) / 1000.0) * degreesPerSecond;
        currentAngle = (currentAngle + deltaAngle) % 360;
        previousTime = currentTime;
        if(currentAngle>45){
            currentAngle=315;
            animateScene4();
        }
        else{
            animateScene3();    
        }
    }
    );
}

function animateScene4(){
    gl.viewport(0, 0, glCanvas.width, glCanvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let radians = currentAngle * Math.PI / 180.0;
    currentRotation[0] = Math.sin(radians);
    currentRotation[1] = Math.cos(radians);

    uRotationVector = gl.getUniformLocation(program, "uRotationVector");
    gl.uniform2fv(uRotationVector, currentRotation);

    gl.useProgram(program);

    //face
    if(currentAngle < 320 && currentAngle >= 315){
        gl.uniform4fv(offsetLoc, [0.900, 0.650, 0.090, 1.0]);
    }
    else if(currentAngle < 325 && currentAngle >= 320){
        gl.uniform4fv(offsetLoc, [0.900, 0.660, 0.090, 1.0]); 
    }
    else if(currentAngle < 330 && currentAngle >= 325){
        gl.uniform4fv(offsetLoc, [0.900, 0.678, 0.090, 1.0]); 
    }
    else if(currentAngle < 335 && currentAngle >= 330){
        gl.uniform4fv(offsetLoc, [0.900, 0.696, 0.090, 1.0]); 
    }
    else if(currentAngle < 340 && currentAngle >= 335){
        gl.uniform4fv(offsetLoc, [0.900, 0.716, 0.090, 1.0]); 
    }
    else if(currentAngle < 345 && currentAngle >= 340){
        gl.uniform4fv(offsetLoc, [0.900, 0.732, 0.090, 1.0]); 
    }
    else if(currentAngle < 350 && currentAngle >= 345){
        gl.uniform4fv(offsetLoc, [0.900, 0.750, 0.090, 1.0]); 
    }
    else if (currentAngle < 360 && currentAngle >= 350){
        gl.uniform4fv(offsetLoc, [0.900, 0.830, 0.090, 1.0]); 
    }
    else if (currentAngle < 10 && currentAngle >= 0){
        gl.uniform4fv(offsetLoc, [0.900, 0.830, 0.090, 1.0]); 
    }
    else if(currentAngle < 15 && currentAngle > 10){
        gl.uniform4fv(offsetLoc, [0.900, 0.750, 0.090, 1.0]); 
    }
    else if(currentAngle < 20 && currentAngle > 15){
        gl.uniform4fv(offsetLoc, [0.900, 0.732, 0.090, 1.0]); 
    }
    else if(currentAngle < 25 && currentAngle > 20){
        gl.uniform4fv(offsetLoc, [0.900, 0.716, 0.090, 1.0]); 
    }
    else if(currentAngle < 30 && currentAngle > 25){
        gl.uniform4fv(offsetLoc, [0.900, 0.696, 0.090, 1.0]);  
    }
    else if(currentAngle < 35 && currentAngle > 30){
        gl.uniform4fv(offsetLoc, [0.900, 0.678, 0.090, 1.0]); 
    }
    else if(currentAngle < 40 && currentAngle > 35){
        gl.uniform4fv(offsetLoc, [0.900, 0.660, 0.090, 1.0]);
    }
    else{
        gl.uniform4fv(offsetLoc, [0.900, 0.650, 0.090, 1.0]);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3*72);
    //rightEye
    gl.uniform4fv(offsetLoc, [0.31, 0.211, 0.078, 1.0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferEyeRight.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3*72);
    //leftEye
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferEyeLeft.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3*72);
    //mask
    gl.uniform4fv(offsetLoc, [0.839, 0.878, 0.921, 1.0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask1.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"),  2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3*120);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask1.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"),  2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3*120*2);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask2.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask3.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask4.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferMask5.position);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    window.requestAnimationFrame(function(currentTime) {
        let deltaAngle = ((currentTime - previousTime) / 1000.0) * degreesPerSecond;
        currentAngle = (currentAngle + deltaAngle) % 360;
        previousTime = currentTime;
        console.log(currentAngle);
        if(currentAngle<45 && currentAngle >43){
            currentAngle = -45;
            animateScene3();
        }
        else{
            animateScene4();    
        }
    }
    );
}
