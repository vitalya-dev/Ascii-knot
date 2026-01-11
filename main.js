import * as THREE from 'three';

// 1. The Curve Class (Your Math)
class TrefoilKnot extends THREE.Curve {
    getPoint(t, optionalTarget = new THREE.Vector3()) {
        const theta = t * 2 * Math.PI;
        
        // GeoGebra Formulas
        const x = Math.sin(theta) + 2 * Math.sin(2 * theta);
        const y = Math.cos(theta) - 2 * Math.cos(2 * theta);
        const z = -Math.sin(3 * theta);
        
        const scale = 4; // Increased scale slightly for better visibility
        return optionalTarget.set(x * scale, y * scale, z * scale);
    }
}

let camera, scene, renderer;
let mesh;

init();
animate();

function init() {
    // --- Scene Setup ---
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0, 0, 0); // Black background

    // --- Camera ---
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20; // Move back to see the whole knot

    // --- Geometry (The Shape) ---
    // Create the path using your class
    const path = new TrefoilKnot();
    // TubeGeometry arguments: path, segments (smoothness), radius (thickness), radiusSegments, closed
    const geometry = new THREE.TubeGeometry(path, 100, 2, 8, true);

    // --- Material (The Look) ---
    // We use PhongMaterial so it reacts to light (brighter parts becomes different ASCII chars later)
    const material = new THREE.MeshPhongMaterial({ flatShading: true, side: THREE.DoubleSide });
    
    // --- Mesh ---
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // --- Lights ---
    // ASCII effects rely on contrast/lighting to choose characters
    const pointLight1 = new THREE.PointLight(0xffffff, 2.5, 0, 0);
    pointLight1.position.set(100, 100, 100);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 1, 0, 0);
    pointLight2.position.set(-100, -100, -100);
    scene.add(pointLight2);

    // --- Renderer (Standard for now, ASCII later) ---
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Handle window resizing
    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Simple rotation to see the 3D shape
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.005;

    renderer.render(scene, camera);
}