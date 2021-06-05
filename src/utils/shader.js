const base = `
precision mediump float;

float distanceTo(vec2 src, vec2 dst) {
    float dx = src.x - dst.x;
    float dy = src.y - dst.y;
    float dv = dx * dx + dy * dy;
    return sqrt(dv);
} 

#define PI 3.14159265359
#define PI2 6.28318530718

`
const surroundLine = {
    // 顶点着色器
    vertexShader: `
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    } 
    `,
    // 片元着色器
    fragmentShader: `
    
    ${base}

    uniform float time;
    uniform float uOpacity;
    uniform float uStartTime;

    uniform vec3 uColor;

    void main() {

        gl_FragColor = vec4(uColor, uOpacity * uStartTime);
    }
    `
}
export default {
    base,
    surroundLine
}