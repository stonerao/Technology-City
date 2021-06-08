import * as THREE from 'three';

const frag_basic = `
precision mediump float;
 
float atan2(float y, float x){
  float t0, t1, t2, t3, t4;
  t3 = abs(x);
  t1 = abs(y);
  t0 = max(t3, t1);
  t1 = min(t3, t1);
  t3 = float(1) / t0;
  t3 = t1 * t3;
  t4 = t3 * t3;
  t0 = -float(0.013480470);
  t0 = t0 * t4 + float(0.057477314);
  t0 = t0 * t4 - float(0.121239071);
  t0 = t0 * t4 + float(0.195635925);
  t0 = t0 * t4 - float(0.332994597);
  t0 = t0 * t4 + float(0.999995630);
  t3 = t0 * t3;
  t3 = (abs(y) > abs(x)) ? float(1.570796327) - t3 : t3;
  t3 = (x < 0.0) ?  float(3.141592654) - t3 : t3;
  t3 = (y < 0.0) ? -t3 : t3;
  return t3;
}
// 计算距离
float distanceTo(vec2 src, vec2 dst) {
	float dx = src.x - dst.x;
	float dy = src.y - dst.y;
	float dv = dx * dx + dy * dy;
	return sqrt(dv);
}

#define PI 3.14159265359
#define PI2 6.28318530718

uniform vec3 u_color;
uniform float time;
uniform float u_opacity;
uniform float u_radius;
uniform float u_width;
uniform float u_speed;

varying vec2 v_position;

    `
const Shader = {
    vertexShader: `
    varying vec2 v_position;
    
    void main() {
        v_position = vec2(position.x, position.y);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
    fragmentShader: `
    ${frag_basic} 
    void main() {
        float d_time = u_speed * time;

        float angle = atan2(v_position.x, v_position.y) + PI;
        
        float angleT = mod(angle + d_time, PI2);

        float width = u_width;
    
        float d_opacity = 0.0;

        // 当前位置离中心位置
        float length = distanceTo(vec2(0.0, 0.0), v_position);
        
        float bw = 5.0;
        if (length < u_radius && length > u_radius - bw) {
            float o = (length - (u_radius - bw)) / bw;
            d_opacity = sin(o * PI); 
        }

        if (length < u_radius - bw / 1.1) {
            d_opacity = 1.0 - angleT / PI * (PI / width);
        } 

        if (length > u_radius) { d_opacity = 0.0; }
 
        gl_FragColor = vec4(u_color, d_opacity * u_opacity);
    }`
}
export default function (opts) {
    const {
        radius = 50,
            color = "#fff",
            speed = 1,
            opacity = 1,
            angle = Math.PI,
            position = {
                x: 0,
                y: 0,
                z: 0
            },
            rotation = {
                x: -Math.PI / 2,
                y: 0,
                z: 0
            }
    } = opts;

    const width = radius * 2;

    const geometry = new THREE.PlaneBufferGeometry(width, width, 1, 1);

    const material = new THREE.ShaderMaterial({
        uniforms: {
            u_radius: {
                value: radius
            },
            u_speed: {
                value: speed
            },
            u_opacity: {
                value: opacity
            },
            u_width: {
                value: angle
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
        side: THREE.DoubleSide,
        vertexShader: Shader.vertexShader,
        fragmentShader: Shader.fragmentShader
    })

    const mesh = new THREE.Mesh(geometry, material);

    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    mesh.position.copy(position);

    return mesh
}