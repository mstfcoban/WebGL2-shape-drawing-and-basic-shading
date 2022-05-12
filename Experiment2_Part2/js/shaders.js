const vsSource = `
attribute vec4 a_position;
uniform vec2 uRotationVector;

void main() {

    vec2 rotatedPosition = vec2(a_position.x * uRotationVector.y + a_position.y * uRotationVector.x,
                                a_position.y * uRotationVector.y - a_position.x * uRotationVector.x );
    
    gl_Position = vec4(rotatedPosition, 0.0, 1.0);
}
`;

const fsSource = `
    precision highp float;
    uniform vec4 u_offset;
    void main() {
        gl_FragColor = u_offset ;
}
`;

const vsSourceStop = `
    attribute vec4 a_position;
    void main() {
        
        gl_Position = a_position;
    }
`;
