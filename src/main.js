import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { initGui } from './interface.js';
import { makeCube } from './cube.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(6, 5, 8);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Create 27 Cubes
const cubes = [];
for(let i=0; i<27; i++) {
    cubes.push(makeCube());
}

// Positioning Logic (Z layers, then Y rows, then X cols)
let idx = 0;
for (let z = -1; z <= 1; z++) {
    for (let y = -1; y <= 1; y++) {
        for (let x = -1; x <= 1; x++) {
            if (cubes[idx]) {
                cubes[idx].position.set(x, y, z);
                cubes[idx].userData.gridPos = { x, y, z };
                idx++;
            }
        }
    }
}

cubes.forEach(c => scene.add(c));

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);
const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
backLight.position.set(-5, -5, -5);
scene.add(backLight);

initGui(cubes);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});