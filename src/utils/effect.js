import * as THREE from 'three'
export default {
    // 获取到包围的线条
    surroundLineGeometry(object) {
        return new THREE.EdgesGeometry(object.geometry);
    }
}