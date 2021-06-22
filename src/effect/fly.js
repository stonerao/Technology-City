import * as THREE from 'three';
export default function (option) {
    const {
        source,
        target,
        height,
        size,
        color,
        range
    } = option;
    const positions = [];
    const attrPositions = [];
    const attrCindex = [];
    const attrCnumber = [];

    const _source = new THREE.Vector3(source.x, source.y, source.z);
    const _target = new THREE.Vector3(target.x, target.y, target.z);
    const _center = _target.clone().lerp(_source, 0.5);
    _center.y += height;

    const number = parseInt(_source.distanceTo(_center) + _target.distanceTo(_center));

    const curve = new THREE.QuadraticBezierCurve3(
        _source,
        _center,
        _target
    );

    const points = curve.getPoints(number);

    // 粒子位置计算 

    points.forEach((elem, i) => {
        const index = i / (number - 1);
        positions.push({
            x: elem.x,
            y: elem.y,
            z: elem.z
        });
        attrCindex.push(index);
        attrCnumber.push(i);
    })


    positions.forEach((p) => {
        attrPositions.push(p.x, p.y, p.z);
    })

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(attrPositions, 3));
    // 传递当前所在位置
    geometry.setAttribute('index', new THREE.Float32BufferAttribute(attrCindex, 1));
    geometry.setAttribute('current', new THREE.Float32BufferAttribute(attrCnumber, 1));

    const shader = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
            uColor: {
                value: new THREE.Color(color) // 颜色
            },
            uRange: {
                value: range || 100 // 显示当前范围的个数
            },
            uSize: {
                value: size // 粒子大小
            },
            uTotal: {
                value: number // 当前粒子的所有的总数
            },
            time: {
                value: 0 // 
            }
        },
        vertexShader: `
        attribute float index;
        attribute float current;
        uniform float time;
        uniform float uSize;
        uniform float uRange; // 展示区间
        uniform float uTotal; // 粒子总数
        uniform vec3 uColor; 
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
            // 需要当前显示的索引
            float size = uSize;
            float showNumber = uTotal * mod(time, 1.1);
            if (showNumber > current && showNumber < current + uRange) {
                float uIndex = ((current + uRange) - showNumber) / uRange;
                size *= uIndex;
                vOpacity = 1.0;
            } else {
                vOpacity = 0.0;
            }

            // 顶点着色器计算后的Position
            vColor = uColor;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition; 
            // 大小
            gl_PointSize = size * 300.0 / (-mvPosition.z);
        }`,
        fragmentShader: `
        varying vec3 vColor; 
        varying float vOpacity;
        void main() {
            gl_FragColor = vec4(vColor, vOpacity);
        }`
    });

    const point = new THREE.Points(geometry, shader);
    
    return point;
}