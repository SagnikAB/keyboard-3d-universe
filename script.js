// ================================
// Keyboard Shortcut Universe PRO
// Clean + Premium + Stable
// ================================

const shortcuts = {
  Q: { combo: "Ctrl + Q", desc: "Close application" },
  W: { combo: "Ctrl + W", desc: "Close current tab" },
  E: { combo: "Ctrl + E", desc: "Search inside app or browser" },
  R: { combo: "Ctrl + R", desc: "Reload page" },
  T: { combo: "Ctrl + T", desc: "Open new tab" },
  Y: { combo: "Ctrl + Y", desc: "Redo last action" },
  U: { combo: "Ctrl + U", desc: "View page source" },
  I: { combo: "Ctrl + I", desc: "Open DevTools" },
  O: { combo: "Ctrl + O", desc: "Open file" },
  A: { combo: "Ctrl + A", desc: "Select all" },
  S: { combo: "Ctrl + S", desc: "Save" },
  D: { combo: "Ctrl + D", desc: "Bookmark page" },
  F: { combo: "Ctrl + F", desc: "Find on page" },
  G: { combo: "Ctrl + G", desc: "Find next" },
  H: { combo: "Ctrl + H", desc: "Open history" },
  J: { combo: "Ctrl + J", desc: "Open downloads" },
  K: { combo: "Ctrl + K", desc: "Focus search bar" },
  L: { combo: "Ctrl + L", desc: "Focus address bar" },
  Z: { combo: "Ctrl + Z", desc: "Undo" },
  X: { combo: "Ctrl + X", desc: "Cut" },
  C: { combo: "Ctrl + C", desc: "Copy" },
  V: { combo: "Ctrl + V", desc: "Paste" },
  B: { combo: "Ctrl + B", desc: "Bold text" },
  N: { combo: "Ctrl + N", desc: "New window" },
  M: { combo: "Ctrl + M", desc: "Minimize window" },
};

const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(0, 5, 16);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.35));

const light = new THREE.DirectionalLight(0x00ffff, 1.4);
light.position.set(6, 10, 8);
scene.add(light);

// Floor grid
const grid = new THREE.GridHelper(100, 100, 0x00ffff, 0x003333);
grid.position.y = -1.2;
scene.add(grid);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const keys = [];

function showShortcut(letter) {
  const data = shortcuts[letter];
  if (!data) return;
  document.getElementById("combo").innerText = data.combo;
  document.getElementById("desc").innerText = data.desc;
}

function createKey(letter, x, y) {
  const geo = new THREE.BoxGeometry(1.6, 0.6, 1.6);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    emissive: 0x00ffff,
    emissiveIntensity: 0.6,
    metalness: 0.7,
    roughness: 0.3,
  });

  const key = new THREE.Mesh(geo, mat);
  key.position.set(x, y, 0);
  key.userData.letter = letter;
  scene.add(key);
  keys.push(key);

  const label = document.createElement("div");
  label.className = "key-label";
  label.innerText = letter;
  document.body.appendChild(label);
  key.userData.label = label;
}

rows.forEach((row, rowIndex) => {
  const y = -rowIndex * 2;
  const offset = -(row.length - 1);
  row.split("").forEach((letter, i) => {
    createKey(letter, i * 2 + offset, y);
  });
});

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

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(keys);

  keys.forEach((k) => (k.material.emissiveIntensity = 0.6));

  if (intersects.length > 0) {
    const key = intersects[0].object;
    key.material.emissiveIntensity = 2;
    showShortcut(key.userData.letter);
  }
});

window.addEventListener("click", () => {
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(keys);
  if (hits.length > 0) {
    const key = hits[0].object;
    key.position.y -= 0.3;
    setTimeout(() => (key.position.y += 0.3), 120);
  }
});

window.addEventListener("keydown", (e) => {
  const letter = e.key.toUpperCase();
  if (shortcuts[letter]) showShortcut(letter);
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Smooth floating camera
function animate() {
  requestAnimationFrame(animate);
  camera.position.x = Math.sin(Date.now() * 0.0003) * 2;
  camera.lookAt(0, -2, 0);
  updateLabels();
  renderer.render(scene, camera);
}

animate();
