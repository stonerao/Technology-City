import * as THREE from 'three';

const vertexShader = `
uniform vec3 u_color;

uniform float time;
uniform float u_height;
 
varying float v_opacity;

void main() {

    vec3 vPosition = position * mod(time, 1.0);

    v_opacity = mix(1.0, 0.0, position.y / u_height);
 
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
}
`;
const fragmentShader = ` 
uniform vec3 u_color;
uniform float u_opacity;
 
varying float v_opacity;

void main() { 
    gl_FragColor = vec4(u_color, v_opacity * u_opacity);
}
`;


export default function (option = {}) {
    const {
        radius,
        height,
        opacity,
        color,
        speed,
        renderOrder
    } = option;
    const geometry = new THREE.CylinderGeometry(radius, radius, height, 32, 1, true);
    geometry.translate(0, height / 2, 0);
    const material = new THREE.ShaderMaterial({
        uniforms: {
            u_height: {
                value: height
            },
            u_speed: {
                value: speed || 1
            },
            u_opacity: {
                value: opacity
            },
            u_color: {
                value: new THREE.Color(color)
            },
            time: {
                value: 0
            }
        },
        transparent: true,
        depthWrite: false,
        depthTest: false,
        side: THREE.DoubleSide,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.renderOrder = renderOrder || 1;
    return mesh;
}