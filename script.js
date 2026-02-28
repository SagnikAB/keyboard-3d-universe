// ===========================================
// CYBER KEYBOARD — FINAL FORM
// ===========================================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.FogExp2(0x001111, 0.06);

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(0, 6, 18);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.4;
document.body.appendChild(renderer.domElement);

// ---------- LIGHTING ----------

scene.add(new THREE.AmbientLight(0xffffff, 0.08));

const rim = new THREE.DirectionalLight(0x00ffff, 3);
rim.position.set(-6, 10, -5);
rim.castShadow = true;
scene.add(rim);

const fill = new THREE.DirectionalLight(0x0044ff, 1.5);
fill.position.set(5, 5, 8);
scene.add(fill);

const pulse = new THREE.PointLight(0x00ffff, 6, 80);
pulse.position.set(0, 8, 4);
scene.add(pulse);

// ---------- FLOOR ----------

const grid = new THREE.GridHelper(100, 100, 0x00ffff, 0x002222);
grid.position.y = -1;
scene.add(grid);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({
    color: 0x020202,
    roughness: 1,
  }),
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1.01;
ground.receiveShadow = true;
scene.add(ground);

// ---------- KEYS ----------

const keys = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function createKey(x) {
  const geo = new THREE.BoxGeometry(1.6, 0.8, 1.6);

  const mat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    metalness: 0.8,
    roughness: 0.1,
    emissive: 0x00ffff,
    emissiveIntensity: 1.2,
  });

  const key = new THREE.Mesh(geo, mat);
  key.position.set(x, 0, 0);
  key.castShadow = true;
  key.receiveShadow = true;

  scene.add(key);
  keys.push(key);
}

for (let i = 0; i < 9; i++) {
  createKey(i * 2 - 8);
}

// ---------- INTERACTION ----------

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(keys);

  keys.forEach((k) => (k.material.emissiveIntensity = 1.2));

  if (intersects.length > 0) {
    intersects[0].object.material.emissiveIntensity = 3.5;
  }
});

window.addEventListener("click", () => {
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(keys);

  if (hits.length > 0) {
    const key = hits[0].object;

    key.position.y = -0.5;
    key.material.emissiveIntensity = 6;

    setTimeout(() => {
      key.position.y = 0;
    }, 150);

    document.getElementById("output").innerHTML =
      "<strong>REALITY BREACHED</strong><br>Hyper Neon Shortcut Activated";
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

  const time = Date.now();

  keys.forEach((k, i) => {
    k.rotation.y += 0.01;
    k.position.y += Math.sin(time * 0.002 + i) * 0.004;
  });

  pulse.intensity = 4 + Math.sin(time * 0.003) * 3;

  camera.position.x = Math.sin(time * 0.0003) * 1.2;
  camera.position.y = 6 + Math.sin(time * 0.0005) * 0.5;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}

animate();
