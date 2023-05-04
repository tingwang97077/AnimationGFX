import { ACESFilmicToneMapping, EquirectangularReflectionMapping, PerspectiveCamera, Scene, WebGLRenderer, sRGBEncoding } from "three";

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";

let camera: THREE.Camera, scene: THREE.Object3D<THREE.Event>, renderer: WebGLRenderer, clock: THREE.Clock, mixer: THREE.AnimationMixer;
var bones: any[] = [];
var bones2: any[] = [];

init();
//animate();

function init() {
    const container = document.querySelector("#app");
    document.body.appendChild(container);

    camera = new PerspectiveCamera(40, window.innerWidth / window.innerHeight, 10, 100);
    camera.position.set(50, 20, 70);

    scene = new Scene();
    clock = new THREE.Clock();

    new THREE.TextureLoader()
        .setPath('/asset/')
        .load('anime_art_style_pokemon.jpeg', (texture) => {

            texture.mapping = EquirectangularReflectionMapping;

            scene.background = texture;
            scene.environment = texture;

            const loader = new GLTFLoader().setPath("/asset/");
            loader.load("drifloon.glb", function (gltf) {
                const geom = gltf.scene;

                scene.add(geom);
                //console.log(scene)
                var object = scene.getObjectByName("Bone");
                bones.push(object);

                while(object){
                  bones.push(object.children[0]);
                  object = object.children[0];
                }

                var object2 = scene.getObjectByName("Bone_1");
                bones.push(object2);

                while(object2){
                  bones.push(object2.children[0]);
                  object2 = object2.children[0];
                }

                for(let i = 0; i < bones.length; i++){
                  if(bones[i] != undefined){
                    bones2.push(bones[i]);
                  }
                }

                console.log(bones2);
                //scene.add(bones);
                
                mixer = new THREE.AnimationMixer(geom);
                gltf.animations.forEach((clip) => {
                    mixer.clipAction(clip).play();
                });
            });

        });

    // renderer
    renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = sRGBEncoding;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 10;
    controls.maxDistance = 100;
    controls.target.set(0, 0, - 0.2);
    controls.update();

    window.addEventListener('resize', onWindowResize);

    animate();

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    var delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    
    bones2.forEach(b => { 
        let r = Math.cos(Date.now() * 0.001) * 0.008;
        b.rotation.x += r
        b.rotation.y += r
        b.rotation.z += r
        b.position.y -= r
        b.position.x += r
        //console.log(b)
    })
    
    //console.log(bones);

    renderer.render(scene, camera);
}