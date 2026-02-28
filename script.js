import * as THREE from "https://unpkg.com/three@0.155.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.155.0/examples/jsm/controls/OrbitControls.js";

// ===============================
// STABLE KEYBOARD UNIVERSE
// ===============================

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(0, 5, 12);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;

// Lighting
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

const dirLight = new THREE.DirectionalLight(0x00ffff, 1.2);
dirLight.position.set(5, 10, 6);
dirLight.castShadow = true;
scene.add(dirLight);

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: 0x111111 }),
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1;
ground.receiveShadow = true;
scene.add(ground);

// Keyboard Layout
const layout = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const keys = [];

function createKey(letter, x) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.5, 1.2),
    new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.6,
      roughness: 0.4,
      emissive: 0x00ffff,
      emissiveIntensity: 0.2,
    }),
  );

  mesh.position.set(x, 0, 0);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData.letter = letter;

  scene.add(mesh);
  keys.push(mesh);
}

layout.forEach((k, i) => {
  createKey(k, i * 1.6 - 7);
});

// Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener("click", () => {
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(keys);

  if (hits.length > 0) {
    const key = hits[0].object;
    pressKey(key);
  }
});

function pressKey(key) {
  key.position.y = -0.3;
  setTimeout(() => (key.position.y = 0), 150);

  document.getElementById("output").innerHTML =
    `<strong>${key.userData.letter}</strong><br>Shortcut activated`;
}

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation
function animate() {
  requestAnimationFrame(animate);

  keys.forEach((k, i) => {
    k.rotation.y += 0.005;
    k.position.y += Math.sin(Date.now() * 0.002 + i) * 0.002;
  });

  controls.update();
  renderer.render(scene, camera);
}

animate();
