import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader';
// Post Processing
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { HalftonePass } from 'three/examples/jsm/postprocessing/HalftonePass';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';


var camera, scene, renderer,
    light1, light2, light3, light4, light5, light6, light7,
    object, stats, controls, composer, renderPass, bloomPass, glitchPass,
    logo;

var clock = new THREE.Clock();

let group, textMesh1, textMesh2, textGeo, material, font;
let text = 'Cesar Araujo Style';

const height = 1,
    size = 3,
    curveSegments = 4,
    bevelThickness = 20,
    bevelSize = 20;
const mirror = false;

init();
animate();

function createText() {

    textGeo = new THREE.TextGeometry(text, {

        font: font,

        size: size,
        height: height,
        curveSegments: curveSegments,

        bevelThickness: bevelThickness,
        bevelSize: bevelSize,
        bevelEnabled: false

    });

    textGeo.computeBoundingBox();
    textGeo.computeVertexNormals();

    const centerOffset = - 0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);

    textMesh1 = new THREE.Mesh(textGeo, material);

    textMesh1.position.x = centerOffset-2;
    textMesh1.position.y = -106.5;
    textMesh1.position.z = 0;

    textMesh1.rotation.x = 0;
    textMesh1.rotation.y = Math.PI * 2;

    group.add(textMesh1);

}

function onPointerDown(event) {

    if (event.isPrimary === false) return;

    pointerXOnPointerDown = event.clientX - windowHalfX;
    targetRotationOnPointerDown = targetRotation;

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);

}

function onPointerMove(event) {

    if (event.isPrimary === false) return;

    pointerX = event.clientX - windowHalfX;

    targetRotation = targetRotationOnPointerDown + (pointerX - pointerXOnPointerDown) * 0.02;

}

function onPointerUp() {

    if (event.isPrimary === false) return;

    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);

}

function refreshText() {

    group.remove(textMesh1);
    if (mirror) group.remove(textMesh2);
    
    if (!text) return;
    
    createText();
    
}



function init() {
    
    material = new THREE.MeshPhongMaterial( { color: 0xffffff } ); // Set your desired color code
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 100;
    scene = new THREE.Scene();


    var sphere = new THREE.SphereBufferGeometry(0.5, 16, 8);

    // /* floor  */    
    const helper = new THREE.GridHelper(1000, 40, 0x303030, 0x303030);
    helper.position.y = - 25;
    scene.add(helper);

    group = new THREE.Group();
    group.position.y = 100;

    scene.add(group);

    const fontLoader = new TTFLoader();

    fontLoader.load('fashion.ttf', function (json) {

        font = new THREE.Font(json);
        createText();
    });

    const loader = new SVGLoader();

    // load a SVG resource
    loader.load(
        // resource URL
        '/ca.svg',
        // called when the resource is loaded
        function (logo) {
            // Group we'll use for all SVG paths
            const svgGroup = new THREE.Group();


            // Loop through all of the parsed paths
            logo.paths.forEach((path, i) => {
                const shapes = path.toShapes(true);

                // Each path has array of shapes
                shapes.forEach((shape, j) => {
                    // Finally we can take each shape and extrude it
                    const geometry = new THREE.ExtrudeGeometry(shape, {
                        depth: 20,
                        bevelEnabled: true
                    });

                    // Create a mesh and add it to the group
                    const mesh = new THREE.Mesh(geometry, material);

                    svgGroup.add(mesh);
                });
            });

            // Meshes we got are all relative to themselves
            // meaning they have position set to (0, 0, 0)
            // which makes centering them in the group easy

            // Get group's size
            const box = new THREE.Box3().setFromObject(svgGroup);
            const size = new THREE.Vector3();
            box.getSize(size);

            const yOffset = size.y / -1;
            const xOffset = size.x / -1.5;

            // Offset all of group's elements, to center them
            svgGroup.children.forEach(item => {
                item.position.x = xOffset;
                item.position.y = yOffset;
            });

            //scale the svg
            const scaleFactor = 0.06
            svgGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);

            // When importing SVGs paths are inverted on Y axis
            // it happens in the process of mapping from 2d to 3d coordinate system
            svgGroup.scale.y *= -1;

            // Finally we add svg group to the scene
            object = svgGroup;
            scene.add(svgGroup);

        },
        // called when loading is in progresses
        function (xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

        },
        // called when loading has errors
        function (error) {

            console.log('An error happened');
            console.error(error)

        }
    );

    //lights

    light1 = new THREE.PointLight(0xff0040, 2, 50);
    light1.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xff0040 })));
    scene.add(light1);

    light2 = new THREE.PointLight(0x0040ff, 2, 50);
    light2.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0x0040ff })));
    scene.add(light2);

    light3 = new THREE.PointLight(0x80ff80, 2, 50);
    light3.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0x80ff80 })));
    scene.add(light3);

    light4 = new THREE.PointLight(0xffaa00, 2, 50);
    light4.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xffaa00 })));
    scene.add(light4);

    light5 = new THREE.PointLight(0xd400ff, 2, 50);
    light5.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xd400ff })));
    scene.add(light5);

    light6 = new THREE.PointLight(0x00ddff, 2, 50);
    light6.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0x00ddff })));
    scene.add(light6);

    light7 = new THREE.PointLight(0xffffff, 2, 50);
    // light7.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) );
    scene.add(light7);

    //renderer

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);

    // Post Processing
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);

    const params = {
        shape: 1,
        radius: 4,
        rotateR: Math.PI / 12,
        rotateB: Math.PI / 12 * 2,
        rotateG: Math.PI / 12 * 3,
        scatter: 0,
        blending: 1,
        blendingMode: 1,
        greyscale: false,
        disable: false
    };

    bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.5,
        0.1,
        0.5
    );

    glitchPass = new GlitchPass();

    const halftonePass = new HalftonePass(window.innerWidth, window.innerHeight, params);

    composer.addPass(renderPass);
    composer.addPass(bloomPass);
    composer.addPass(glitchPass);

    setTimeout(() => composer.removePass(glitchPass), 1000)
    // composer.addPass( halftonePass );


}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {



    requestAnimationFrame(animate);

    // stats.update();
    render();
}

function render() {

    var time = Date.now() * 0.0005;
    var delta = clock.getDelta();

    if (object) object.rotation.y -= 0.5 * delta;

    light1.position.x = Math.sin(time * 0.7) * 30;
    light1.position.y = Math.cos(time * 0.5) * 40;
    light1.position.z = Math.cos(time * 0.3) * 30;

    light2.position.x = Math.cos(time * 0.3) * 30;
    light2.position.y = Math.sin(time * 0.5) * 40;
    light2.position.z = Math.sin(time * 0.7) * 30;

    light3.position.x = Math.sin(time * 0.7) * 30;
    light3.position.y = Math.cos(time * 0.3) * 40;
    light3.position.z = Math.sin(time * 0.5) * 30;

    light4.position.x = Math.sin(time * 0.3) * 30;
    light4.position.y = Math.cos(time * 0.7) * 40;
    light4.position.z = Math.sin(time * 0.5) * 30;

    light5.position.x = Math.sin(time * 0.1) * 30;
    light5.position.y = Math.cos(time * 0.2) * 40;
    light5.position.z = Math.sin(time * 0.3) * 30;

    light6.position.x = Math.sin(time * 0.4) * 30;
    light6.position.y = Math.cos(time * 0.5) * 40;
    light6.position.z = Math.sin(time * 0.6) * 30;

    renderer.render(scene, camera);

    composer.render()

}

window.addEventListener('resize', function (event) {
    onWindowResize()
});