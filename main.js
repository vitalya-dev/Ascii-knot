import * as THREE from 'three';
// Import the controls
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class TrefoilKnot extends THREE.Curve {
    getPoint(t, optionalTarget = new THREE.Vector3()) {
        const theta = t * 2 * Math.PI;
        
        // GeoGebra Formulas
        const x = Math.sin(theta) + 2 * Math.sin(2 * theta);
        const y = Math.cos(theta) - 2 * Math.cos(2 * theta);
        const z = -Math.sin(3 * theta);
        
        const scale = 4;
        return optionalTarget.set(x * scale, y * scale, z * scale);
    }
}

let camera, scene, renderer, controls;
let mesh;

init();
animate();

function init() {
    // --- Scene Setup ---
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0, 0, 0);

    // --- Camera ---
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;

    // --- Geometry ---
    const path = new TrefoilKnot();
    // Smooth tube: 100 segments, radius 2, 8 radiusSegments, closed=true
    const geometry = new THREE.TubeGeometry(path, 100, 2, 8, true);

    // --- Material ---
    // Added wireframe: false (default), color is white (default)
    const material = new THREE.MeshPhongMaterial({ 
        flatShading: true, 
        side: THREE.DoubleSide,
        color: 0x00ff00, // I added a simple green color to distinguish it
        shininess: 60
    });
    
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // --- Lights ---
    const pointLight1 = new THREE.PointLight(0xffffff, 2.5, 0, 0);
    pointLight1.position.set(100, 100, 100);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 1, 0, 0);
    pointLight2.position.set(-100, -100, -100);
    scene.add(pointLight2);

    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    scene.add(ambientLight);

    // --- Renderer ---
    renderer = new THREE.WebGLRenderer({ antialias: true }); // Antialias makes edges smooth
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // Sharpness on high-res screens
    document.body.appendChild(renderer.domElement);

    // --- OrbitControls ---
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Adds a smooth 'weight' to the movement
    controls.dampingFactor = 0.05;

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Optional: Keep the auto-rotation if you like, 
    // or comment these out to only control it manually.
    //mesh.rotation.x += 0.005;
    // mesh.rotation.y += 0.005;

    // Must call update() every frame if enableDamping is true
    controls.update();

    renderer.render(scene, camera);
}