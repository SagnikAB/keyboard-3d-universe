const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);

const light = new THREE.PointLight(0x00ffff, 2);
light.position.set(5, 10, 5);
scene.add(light);

// Shortcut Database
const shortcutDB = {
  A: ["Ctrl + A → Select All"],
  C: ["Ctrl + C → Copy"],
  V: ["Ctrl + V → Paste"],
  Z: ["Ctrl + Z → Undo"],
  S: ["Ctrl + S → Save"],
  F: ["Ctrl + F → Find"],
  K: ["EASTER EGG FOUND 👀"],
};

// Create Key Function
function createKey(letter, x, y) {
  const group = new THREE.Group();

  const baseGeometry = new THREE.BoxGeometry(1, 0.3, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.4,
    metalness: 0.8,
    emissive: 0x00ffff,
    emissiveIntensity: 0.1,
  });

  const key = new THREE.Mesh(baseGeometry, material);
  group.add(key);

  group.position.set(x, y, 0);
  group.userData = { letter: letter, mesh: key };

  scene.add(group);
  return group;
}

// Layout
const keys = [];
const letters = ["A", "C", "V", "Z", "S", "F", "K"];

letters.forEach((letter, i) => {
  const key = createKey(letter, i * 1.5 - 4, 0);
  keys.push(key);
});

camera.position.z = 8;

// Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const parent = intersects[0].object.parent;
    if (parent.userData.letter) {
      pressKey(parent);
    }
  }
});

function pressKey(keyGroup) {
  const letter = keyGroup.userData.letter;

  // Press animation
  keyGroup.position.z = -0.2;
  setTimeout(() => {
    keyGroup.position.z = 0;
  }, 150);

  // Glow boost
  keyGroup.userData.mesh.material.emissiveIntensity = 1;
  setTimeout(() => {
    keyGroup.userData.mesh.material.emissiveIntensity = 0.1;
  }, 200);

  // Show Output
  const output = document.getElementById("output");
  output.innerHTML =
    `<strong>${letter}</strong><br>` +
    (shortcutDB[letter]
      ? shortcutDB[letter].join("<br>")
      : "No shortcut found");

  // Easter Egg Trigger
  if (letter === "K") {
    document.body.style.background = "linear-gradient(45deg, purple, black)";
    output.innerHTML += "<br>💜 Cyber Mode Activated";
  }
}

// Konami Code Easter Egg
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
    activateGodMode();
  }
});

function activateGodMode() {
  document.getElementById("output").innerHTML =
    "🚀 GOD MODE ACTIVATED<br>All shortcuts unlocked.";

  keys.forEach((key) => {
    key.userData.mesh.material.color.set(0xff0000);
  });
}

// Animation
function animate() {
  requestAnimationFrame(animate);

  keys.forEach((key) => {
    key.rotation.y += 0.005;
  });

  renderer.render(scene, camera);
}

animate();
