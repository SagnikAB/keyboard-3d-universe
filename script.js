// ===========================================
// ULTIMATE CYBER KEYBOARD (Vercel Safe)
// ===========================================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.FogExp2(0x000000, 0.08);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(0, 5, 15);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// ---------- LIGHTING ----------

scene.add(new THREE.AmbientLight(0xffffff, 0.1));

const rim = new THREE.DirectionalLight(0x00ffff, 2);
rim.position.set(-5, 8, -5);
rim.castShadow = true;
scene.add(rim);

const fill = new THREE.DirectionalLight(0x0088ff, 1.2);
fill.position.set(5, 6, 8);
scene.add(fill);

const pulse = new THREE.PointLight(0x00ffff, 4, 60);
pulse.position.set(0, 6, 4);
scene.add(pulse);

// ---------- FLOOR ----------

const grid = new THREE.GridHelper(80, 80, 0x00ffff, 0x003333);
grid.position.y = -0.99;
scene.add(grid);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(80, 80),
  new THREE.MeshStandardMaterial({
    color: 0x050505,
    roughness: 1,
  }),
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1;
ground.receiveShadow = true;
scene.add(ground);

// ---------- KEYS ----------

const keys = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function createKey(x) {
  const geo = new THREE.BoxGeometry(1.4, 0.7, 1.4);

  const mat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    metalness: 0.7,
    roughness: 0.15,
    emissive: 0x00ffff,
    emissiveIntensity: 0.8,
  });

  const key = new THREE.Mesh(geo, mat);
  key.position.set(x, 0, 0);
  key.castShadow = true;
  key.receiveShadow = true;

  scene.add(key);
  keys.push(key);
}

for (let i = 0; i < 9; i++) {
  createKey(i * 1.8 - 7);
}

// ---------- HOVER GLOW ----------

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(keys);

  keys.forEach((k) => (k.material.emissiveIntensity = 0.8));

  if (intersects.length > 0) {
    intersects[0].object.material.emissiveIntensity = 2.5;
  }
});

// ---------- CLICK ----------

window.addEventListener("click", () => {
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(keys);

  if (hits.length > 0) {
    const key = hits[0].object;

    key.position.y = -0.4;
    key.material.emissiveIntensity = 4;

    setTimeout(() => {
      key.position.y = 0;
    }, 150);

    document.getElementById("output").innerHTML =
      "<strong>ULTIMATE MODE</strong><br>Neon shortcut executed";
  }
});

// ---------- RESIZE ----------

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---------- ANIMATION ----------

function animate() {
  requestAnimationFrame(animate);

  keys.forEach((k, i) => {
    k.rotation.y += 0.01;
    k.position.y += Math.sin(Date.now() * 0.002 + i) * 0.004;
  });

  // Light pulse
  pulse.intensity = 3 + Math.sin(Date.now() * 0.003) * 2;

  // Subtle camera drift
  camera.position.x = Math.sin(Date.now() * 0.0004) * 0.7;
  camera.lookAt(0, 0, 0);

  // Grid pulse
  grid.material.color.setHSL(0.5, 1, 0.4 + Math.sin(Date.now() * 0.002) * 0.1);

  renderer.render(scene, camera);
}

animate();
