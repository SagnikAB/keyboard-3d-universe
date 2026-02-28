// =====================================================
// KEYBOARD SHORTCUT UNIVERSE — STABLE VERSION
// =====================================================

// ---------- SCENE ----------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(0, 5, 14);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// ---------- CONTROLS ----------
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;

// ---------- LIGHTS ----------
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

const light = new THREE.DirectionalLight(0x00ffff, 1.3);
light.position.set(5, 10, 6);
light.castShadow = true;
scene.add(light);

// ---------- GROUND ----------
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: 0x111111 }),
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1;
ground.receiveShadow = true;
scene.add(ground);

// ---------- SHORTCUT DATA ----------
const shortcuts = {
  Q: "Quick Access",
  W: "Close Window (Alt+F4)",
  E: "Explorer",
  R: "Run (Win+R)",
  T: "New Tab",
  Y: "Redo",
  U: "Underline",
  I: "Italic",
  O: "Open File",
  P: "Print",
};

// ---------- KEYBOARD ----------
const layout = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const keys = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function createKey(letter, x) {
  const group = new THREE.Group();

  const keyMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.5, 1.2),
    new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.6,
      roughness: 0.4,
      emissive: 0x00ffff,
      emissiveIntensity: 0.15,
    }),
  );

  keyMesh.castShadow = true;
  keyMesh.receiveShadow = true;
  group.add(keyMesh);

  group.position.set(x, 0, 0);
  group.userData = { letter, mesh: keyMesh };

  scene.add(group);
  keys.push(group);
}

// Create keyboard immediately (NO FONT DEPENDENCY)
layout.forEach((k, i) => {
  createKey(k, i * 1.6 - 7);
});

// ---------- LOAD FONT (OPTIONAL TEXT) ----------
const loader = new THREE.FontLoader();
loader.load(
  "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
  function (font) {
    keys.forEach((key) => {
      const letter = key.userData.letter;

      const text = new THREE.Mesh(
        new THREE.TextGeometry(letter, {
          font: font,
          size: 0.35,
          height: 0.05,
        }),
        new THREE.MeshStandardMaterial({ color: 0x00ffff }),
      );

      text.position.set(-0.18, 0.2, 0.4);
      key.add(text);
    });
  },
  undefined,
  function () {
    console.warn("Font failed to load — continuing without text.");
  },
);

// ---------- INTERACTION ----------
window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener("click", () => {
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(keys);

  if (hits.length > 0) {
    pressKey(hits[0].object);
  }
});

function pressKey(key) {
  const letter = key.userData.letter;

  key.position.y = -0.3;
  setTimeout(() => (key.position.y = 0), 150);

  document.getElementById("output").innerHTML =
    `<strong>${letter}</strong><br>${shortcuts[letter]}`;
}

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
    k.rotation.y += 0.005;
    k.position.y += Math.sin(Date.now() * 0.002 + i) * 0.002;
  });

  controls.update();
  renderer.render(scene, camera);
}

animate();
