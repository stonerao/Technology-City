import * as THREE from 'three'
import {
    FBXLoader
} from 'three/examples/jsm/loaders/FBXLoader.js'

class City {
    constructor() {
        this.fbxLoader = new FBXLoader();
        this.group = new THREE.Group();

        this.loadFbx('/model/shanghai.FBX').then((obj) => {
            this.group.add(obj);
        });

        this.init();
    }

    /**
     *  Loader Model
     */
    loadFbx(url) {
        return new Promise((resolve, reject) => {
            try {
                this.fbxLoader.load(url, (obj) => {
                    resolve(obj);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    init() {

    }

    animate = (dt) => {

    }
}

export default City;