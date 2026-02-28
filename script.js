// =======================================
// INSANE PORTFOLIO MODE — CYBER KEYBOARD
// =======================================

// ---------- Scene ----------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.Fog(0x000000, 15, 40);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

// Cinematic angle
camera.position.set(0, 5, 14);
camera.lookAt(0, 0, 0);

// ---------- Renderer ----------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// ---------- Lighting ----------
scene.add(new THREE.AmbientLight(0xffffff, 0.25));

// Neon rim light
const rimLight = new THREE.DirectionalLight(0x00ffff, 1.5);
rimLight.position.set(-5, 8, -5);
rimLight.castShadow = true;
scene.add(rimLight);

// Front light
const frontLight = new THREE.DirectionalLight(0x00ffff, 0.8);
frontLight.position.set(5, 5, 10);
scene.add(frontLight);

// Pulsing glow light
const pulseLight = new THREE.PointLight(0x00ffff, 2, 50);
pulseLight.position.set(0, 6, 5);
scene.add(pulseLight);

// ---------- Ground ----------
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(60, 60),
  new THREE.MeshStandardMaterial({
    color: 0x050505,
    roughness: 1,
    metalness: 0,
  }),
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1;
ground.receiveShadow = true;
scene.add(ground);

// ---------- Keys ----------
const keys = [];

function createKey(x) {
  const geometry = new THREE.BoxGeometry(1.3, 0.6, 1.3);

  const material = new THREE.MeshPhysicalMaterial({
    color: 0x111111,
    metalness: 0.4,
    roughness: 0.2,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    transmission: 0.2, // glass effect
    thickness: 1.2,
    emissive: 0x00ffff,
    emissiveIntensity: 0.4,
  });

  const key = new THREE.Mesh(geometry, material);
  key.position.set(x, 0, 0);
  key.castShadow = true;
  key.receiveShadow = true;

  scene.add(key);
  keys.push(key);
}

for (let i = 0; i < 9; i++) {
  createKey(i * 1.7 - 7);
}

// ---------- Interaction ----------
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener("click", () => {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(keys);

  if (intersects.length > 0) {
    const key = intersects[0].object;

    // Press animation
    key.position.y = -0.3;
    key.material.emissiveIntensity = 2;

    setTimeout(() => {
      key.position.y = 0;
      key.material.emissiveIntensity = 0.4;
    }, 150);

    document.getElementById("output").innerHTML =
      "<strong>Activated</strong><br>Cyber shortcut triggered";
  }
});

// ---------- Resize ----------
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---------- Animation ----------
function animate() {
  requestAnimationFrame(animate);

  keys.forEach((k, i) => {
    k.rotation.y += 0.01;
    k.position.y += Math.sin(Date.now() * 0.002 + i) * 0.003;
  });

  // Pulse light animation
  pulseLight.intensity = 1.5 + Math.sin(Date.now() * 0.003) * 0.8;

  renderer.render(scene, camera);
}

animate();
