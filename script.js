// ======================================
// Keyboard Shortcut Universe
// Stable CDN Version (No Modules)
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
light.castShadow = true;
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

// LOAD FONT PROPERLY
const loader = new THREE.FontLoader();

loader.load(
  "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
  function (font) {
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
      key.castShadow = true;
      key.userData.letter = letter;

      scene.add(key);
      keys.push(key);

      // TEXT
      const textGeo = new THREE.TextGeometry(letter, {
        font: font,
        size: 0.5,
        height: 0.05,
      });

      textGeo.computeBoundingBox();
      const textMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const text = new THREE.Mesh(textGeo, textMat);

      const centerOffset =
        -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);

      text.position.set(x + centerOffset, 0.35, 0.6);
      scene.add(text);
    }

    Object.keys(shortcuts).forEach((letter, i) => {
      createKey(letter, i * 2 - 8);
    });
  },
);

// HOVER
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

// CLICK ANIMATION
window.addEventListener("click", () => {
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(keys);

  if (hits.length > 0) {
    const key = hits[0].object;
    key.position.y = -0.2;

    setTimeout(() => {
      key.position.y = 0;
    }, 120);
  }
});

// REAL KEYBOARD SUPPORT
window.addEventListener("keydown", (e) => {
  const letter = e.key.toUpperCase();
  if (shortcuts[letter]) {
    showShortcut(letter);
  }
});

// RESIZE
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
