// ==============================
// UPGRADED STABLE 3D VERSION
// ==============================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

// Cinematic angle
camera.position.set(0, 4, 12);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Lighting
scene.add(new THREE.AmbientLight(0xffffff, 0.3));

const dirLight = new THREE.DirectionalLight(0x00ffff, 1.5);
dirLight.position.set(5, 10, 7);
dirLight.castShadow = true;
scene.add(dirLight);

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 1 }),
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1;
ground.receiveShadow = true;
scene.add(ground);

// Keys
const keys = [];

function createKey(x) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.6, 1.2),
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
  scene.add(mesh);
  keys.push(mesh);
}

for (let i = 0; i < 8; i++) {
  createKey(i * 1.6 - 6);
}

// Click Interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(keys);

  if (intersects.length > 0) {
    const key = intersects[0].object;

    key.position.y = -0.3;
    key.material.emissiveIntensity = 1;

    setTimeout(() => {
      key.position.y = 0;
      key.material.emissiveIntensity = 0.2;
    }, 150);
  }
});

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
    k.rotation.y += 0.01;
    k.position.y += Math.sin(Date.now() * 0.002 + i) * 0.002;
  });

  renderer.render(scene, camera);
}

animate();
