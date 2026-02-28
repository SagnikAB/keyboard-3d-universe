// ==============================
// STABLE THREE VERSION (NO MODULES)
// ==============================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.PointLight(0x00ffff, 2);
light.position.set(5, 5, 5);
scene.add(light);

scene.add(new THREE.AmbientLight(0xffffff, 0.3));

// Create Keys
const keys = [];

function createKey(x) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.5, 1.2),
    new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      emissive: 0x00ffff,
      emissiveIntensity: 0.2,
      metalness: 0.6,
      roughness: 0.4,
    }),
  );

  mesh.position.x = x;
  scene.add(mesh);
  keys.push(mesh);
}

for (let i = 0; i < 8; i++) {
  createKey(i * 1.6 - 6);
}

// Animation
function animate() {
  requestAnimationFrame(animate);

  keys.forEach((k, i) => {
    k.rotation.y += 0.01;
    k.position.y = Math.sin(Date.now() * 0.002 + i) * 0.2;
  });

  renderer.render(scene, camera);
}

animate();
