// ======================================
// Keyboard Shortcut Universe (Stable)
// No FontLoader. No TextGeometry.
// Clean UX. Production safe.
// ======================================

const shortcuts = {
  Q: { combo: "Ctrl + Q", desc: "Close application" },
  W: { combo: "Ctrl + W", desc: "Close current tab" },
  E: { combo: "Ctrl + E", desc: "Search inside app or browser" },
  R: { combo: "Ctrl + R", desc: "Reload page" },
  T: { combo: "Ctrl + T", desc: "Open new tab" },
  Y: { combo: "Ctrl + Y", desc: "Redo last action" },
  U: { combo: "Ctrl + U", desc: "View page source" },
  I: { combo: "Ctrl + I", desc: "Italic text or DevTools" },
  O: { combo: "Ctrl + O", desc: "Open file" },
};

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(0, 4, 14);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.3));

const light = new THREE.DirectionalLight(0x00ffff, 1.2);
light.position.set(5, 8, 5);
scene.add(light);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const keys = [];

function showShortcut(letter) {
  const data = shortcuts[letter];
  if (!data) return;

  document.getElementById("combo").innerText = data.combo;
  document.getElementById("desc").innerText = data.desc;
}

function createKey(letter, x) {
  const geo = new THREE.BoxGeometry(1.6, 0.6, 1.6);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    emissive: 0x00ffff,
    emissiveIntensity: 0.5,
    metalness: 0.6,
    roughness: 0.3,
  });

  const key = new THREE.Mesh(geo, mat);
  key.position.set(x, 0, 0);
  key.userData.letter = letter;

  scene.add(key);
  keys.push(key);

  // HTML label instead of 3D text
  const label = document.createElement("div");
  label.className = "key-label";
  label.innerText = letter;
  document.body.appendChild(label);

  key.userData.label = label;
}

Object.keys(shortcuts).forEach((letter, i) => {
  createKey(letter, i * 2 - 8);
});

// Update label positions
function updateLabels() {
  keys.forEach((key) => {
    const vector = key.position.clone();
    vector.project(camera);

    const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;

    key.userData.label.style.left = `${x}px`;
    key.userData.label.style.top = `${y - 20}px`;
  });
}

// Hover
window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(keys);

  keys.forEach((k) => (k.material.emissiveIntensity = 0.5));

  if (intersects.length > 0) {
    const key = intersects[0].object;
    key.material.emissiveIntensity = 2;
    showShortcut(key.userData.letter);
  }
});

// Click animation
window.addEventListener("click", () => {
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(keys);

  if (hits.length > 0) {
    const key = hits[0].object;
    key.position.y = -0.2;
    setTimeout(() => (key.position.y = 0), 120);
  }
});

// Keyboard support
window.addEventListener("keydown", (e) => {
  const letter = e.key.toUpperCase();
  if (shortcuts[letter]) {
    showShortcut(letter);
  }
});

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  updateLabels();
  renderer.render(scene, camera);
}

animate();
