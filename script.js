// ==============================
// KEYBOARD SHORTCUT UNIVERSE
// ULTIMATE EDITION
// ==============================

// ---------- Scene ----------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.Fog(0x000000, 20, 60);

// ---------- Camera ----------
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(0, 6, 14);

// ---------- Renderer ----------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// ---------- Controls ----------
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 8;
controls.maxDistance = 25;

// ---------- Lights ----------
scene.add(new THREE.AmbientLight(0xffffff, 0.3));

const keyLight = new THREE.DirectionalLight(0x00ffff, 1.5);
keyLight.position.set(5, 10, 6);
keyLight.castShadow = true;
scene.add(keyLight);

const pulseLight = new THREE.PointLight(0x00ffff, 2, 40);
pulseLight.position.set(0, 6, 5);
scene.add(pulseLight);

// ---------- Ground ----------
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 1 }),
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1;
ground.receiveShadow = true;
scene.add(ground);

// ---------- Shortcut DB ----------
const shortcuts = {
  Q: ["Ctrl + Q → Quit"],
  W: ["Ctrl + W → Close Tab"],
  E: ["Ctrl + E → Search"],
  R: ["Ctrl + R → Refresh"],
  A: ["Ctrl + A → Select All"],
  S: ["Ctrl + S → Save"],
  D: ["Ctrl + D → Bookmark"],
  F: ["Ctrl + F → Find"],
  Z: ["Ctrl + Z → Undo"],
  X: ["Ctrl + X → Cut"],
  C: ["Ctrl + C → Copy"],
  V: ["Ctrl + V → Paste"],
  K: ["👀 Cyber Mode Activated"],
};

// ---------- Font ----------
let font;
new THREE.FontLoader().load(
  "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
  (f) => {
    font = f;
    createKeyboard();
  },
);

// ---------- Keyboard ----------
const keys = [];
const layout = [
  "Q",
  "W",
  "E",
  "R",
  "A",
  "S",
  "D",
  "F",
  "Z",
  "X",
  "C",
  "V",
  "K",
];

function createKeyboard() {
  layout.forEach((letter, i) => {
    const key = createKey(letter, i * 1.6 - 9);
    keys.push(key);
  });
}

function createKey(letter, x) {
  const group = new THREE.Group();

  const keyMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.5, 1.4, 4, 4, 4),
    new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.7,
      roughness: 0.3,
      emissive: 0x00ffff,
      emissiveIntensity: 0.15,
    }),
  );

  keyMesh.castShadow = true;
  keyMesh.receiveShadow = true;
  group.add(keyMesh);

  // 3D Text
  const text = new THREE.Mesh(
    new THREE.TextGeometry(letter, {
      font,
      size: 0.5,
      height: 0.1,
    }),
    new THREE.MeshStandardMaterial({ color: 0x00ffcc }),
  );
  text.position.set(-0.2, 0.35, 0.6);
  group.add(text);

  group.position.set(x, 0, 0);
  group.userData.letter = letter;
  group.userData.keyMesh = keyMesh;

  scene.add(group);
  return group;
}

// ---------- Interaction ----------
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hovered = null;

window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener("click", () => {
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(keys, true);

  if (hits.length) {
    const key = hits[0].object.parent;
    pressKey(key);
  }
});

function pressKey(key) {
  const mesh = key.userData.keyMesh;
  const letter = key.userData.letter;

  gsap.to(mesh.position, {
    y: -0.25,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
  });

  document.getElementById("output").innerHTML =
    `<strong>${letter}</strong><br>` +
    (shortcuts[letter] || ["No shortcut"]).join("<br>");

  if (letter === "K") cyberMode();
}

// ---------- Easter Eggs ----------
function cyberMode() {
  document.body.style.background = "linear-gradient(45deg, purple, black)";
  keys.forEach((k) => k.userData.keyMesh.material.color.set(0xff00ff));
}

// Konami Code
let konami = [];
const secret = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

window.addEventListener("keydown", (e) => {
  konami.push(e.key);
  if (konami.length > secret.length) konami.shift();
  if (JSON.stringify(konami) === JSON.stringify(secret)) {
    document.getElementById("output").innerHTML = "🚀 GOD MODE ACTIVATED";
    keys.forEach((k) => k.userData.keyMesh.material.color.set(0xff0000));
  }
});

// ---------- Animate ----------
function animate() {
  requestAnimationFrame(animate);

  keys.forEach((k, i) => {
    k.rotation.y += 0.005;
    k.position.y = Math.sin(Date.now() * 0.002 + i) * 0.08;
  });

  pulseLight.intensity = 1.5 + Math.sin(Date.now() * 0.003) * 0.5;

  controls.update();
  renderer.render(scene, camera);
}

animate();

// ---------- Resize ----------
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
