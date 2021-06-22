/**
 * 公共方法
 */
// import * as THREE from 'three'

export default {
    forMaterial(materials, callback) {
        if (!callback || !materials) return false;
        if (Array.isArray(materials)) {
            materials.forEach((mat) => {
                callback(mat);
            });
        } else {
            callback(materials);
        }
    }
}

