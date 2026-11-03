import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createArchitecture } from "./architecture";
import { content } from "./content";

export type SceneController = {
  setView: (index: number) => void;
  setDay: (day: boolean) => void;
  setLowPower: (low: boolean) => void;
  orbit: (direction: number) => void;
  destroy: () => void;
};

type SceneOptions = {
  hero?: boolean;
  onReady: () => void;
  onError: () => void;
};

export function createScene(
  host: HTMLElement,
  options: SceneOptions,
): SceneController {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: Boolean(options.hero),
      powerPreference: "low-power",
    });
  } catch {
    options.onError();
    return {
      setView() {},
      setDay() {},
      setLowPower() {},
      orbit() {},
      destroy() {},
    };
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.shadowMap.enabled = !options.hero;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute("aria-hidden", "true");
  renderer.domElement.setAttribute(
    "aria-label",
    "Three-dimensional LAVA architectural model",
  );
  host.append(renderer.domElement);

  const scene = new THREE.Scene();
  if (!options.hero) scene.background = new THREE.Color("#0c1521");
  if (!options.hero) scene.fog = new THREE.Fog("#0c1521", 28, 72);
  const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 150);
  const model = createArchitecture();
  scene.add(model.group);
  // The introductory scene uses direct light. Environment prefiltering is reserved for the explorer.
  let environment: THREE.WebGLRenderTarget | undefined;
  if (!options.hero) {
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    environment = pmrem.fromScene(room, 0.04);
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.35;
    room.dispose();
    pmrem.dispose();
  } else {
    model.group.traverse((object) => {
      if (
        object instanceof THREE.Mesh &&
        object.material instanceof THREE.MeshStandardMaterial
      )
        object.material.metalness = Math.min(object.material.metalness, 0.2);
    });
  }

  const hemisphere = new THREE.HemisphereLight("#b8d3e6", "#171411", 1.6);
  const key = new THREE.DirectionalLight("#e0d7c6", 3.4);
  key.position.set(-6, 14, 10);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -12;
  key.shadow.camera.right = 12;
  key.shadow.camera.top = 12;
  key.shadow.camera.bottom = -12;
  key.shadow.normalBias = 0.03;
  const rim = new THREE.DirectionalLight("#86a9c6", 1.8);
  rim.position.set(9, 6, -7);
  scene.add(hemisphere, key, rim);
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(150, 150),
    new THREE.MeshStandardMaterial({
      color: "#0d1923",
      roughness: 0.42,
      metalness: 0.6,
    }),
  );
  ground.visible = !options.hero;
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.3;
  ground.receiveShadow = true;
  scene.add(ground);
  // A subdued mirrored silhouette reads as water without a second render pass.
  const reflection = model.group.clone();
  reflection.scale.y = -1;
  reflection.position.y = -0.65;
  reflection.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      const original = object.material as THREE.Material;
      const material = original.clone();
      material.transparent = true;
      material.opacity = options.hero ? 0.035 : 0.08;
      material.depthWrite = false;
      object.material = material;
      object.castShadow = false;
      object.receiveShadow = false;
    }
  });
  if (!options.hero) scene.add(reflection);

  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const desiredPosition = new THREE.Vector3();
  const desiredTarget = new THREE.Vector3(0, 2.2, 0);
  const currentTarget = desiredTarget.clone();
  const targetColor = new THREE.Color("#0c1521");
  let index = 0,
    day = false,
    low = false,
    visible = true,
    disposed = false,
    ready = false,
    compiled = false,
    frame = 0;
  let scrollProgress = 0,
    pointerOffset = 0,
    orbitAngle = 0,
    dragStart: number | null = null;
  let width = 0,
    height = 0;
  function updateCamera() {
    const view = content.views[index];
    desiredPosition.fromArray(view.position);
    desiredTarget.fromArray(view.target);
    if (options.hero) {
      desiredPosition.set(17 - scrollProgress * 2, 10 + scrollProgress, 21);
      desiredTarget.set(0, 2.15, 0);
    }
    const narrow = width / height < 1.2;
    const distanceScale = narrow ? 1.27 : 1;
    desiredPosition.multiplyScalar(distanceScale);
    desiredPosition.applyAxisAngle(
      THREE.Object3D.DEFAULT_UP,
      orbitAngle + pointerOffset,
    );
  }
  function requestRender() {
    if (compiled && !frame && visible && !disposed && !document.hidden)
      frame = requestAnimationFrame(render);
  }
  function render() {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    updateCamera();
    const immediate = reduced.matches || low;
    camera.position.lerp(desiredPosition, immediate ? 1 : 0.09);
    currentTarget.lerp(desiredTarget, immediate ? 1 : 0.09);
    camera.lookAt(currentTarget);
    renderer.render(scene, camera);
    if (!ready) {
      ready = true;
      host.classList.add("is-ready");
      host.setAttribute("aria-busy", "false");
      options.onReady();
    }
    if (
      camera.position.distanceToSquared(desiredPosition) > 0.0001 ||
      currentTarget.distanceToSquared(desiredTarget) > 0.0001
    )
      requestRender();
  }
  function resize() {
    width = host.clientWidth;
    height = host.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    updateCamera();
    if (!ready) camera.position.copy(desiredPosition);
    requestRender();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const intersection = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible) requestRender();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    },
    { rootMargin: "80px" },
  );
  intersection.observe(host);
  function scroll() {
    if (!options.hero || reduced.matches || !visible) return;
    const parent = host.parentElement;
    if (parent)
      scrollProgress = Math.min(
        1,
        Math.max(0, -parent.getBoundingClientRect().top / parent.clientHeight),
      );
    requestRender();
  }
  function pointerMove(event: PointerEvent) {
    if (options.hero || reduced.matches || low) return;
    if (dragStart !== null) {
      orbitAngle += (event.clientX - dragStart) * 0.005;
      dragStart = event.clientX;
    } else
      pointerOffset =
        ((event.clientX - host.getBoundingClientRect().left) / width - 0.5) *
        0.035;
    requestRender();
  }
  function pointerDown(event: PointerEvent) {
    if (options.hero || event.pointerType === "touch") return;
    dragStart = event.clientX;
    host.setPointerCapture(event.pointerId);
  }
  function pointerUp() {
    dragStart = null;
  }
  function visibility() {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else requestRender();
  }
  function lost(event: Event) {
    event.preventDefault();
    host.classList.remove("is-ready");
    host.setAttribute("aria-busy", "false");
    cancelAnimationFrame(frame);
    frame = 0;
    visible = false;
    options.onError();
  }
  host.addEventListener("pointermove", pointerMove);
  host.addEventListener("pointerdown", pointerDown);
  host.addEventListener("pointerup", pointerUp);
  host.addEventListener("pointercancel", pointerUp);
  renderer.domElement.addEventListener("webglcontextlost", lost);
  window.addEventListener("scroll", scroll, { passive: true });
  document.addEventListener("visibilitychange", visibility);
  reduced.addEventListener("change", requestRender);
  resize();
  void renderer
    .compileAsync(scene, camera)
    .then(() => {
      compiled = true;
      requestRender();
    })
    .catch(() => {
      visible = false;
      options.onError();
    });

  return {
    setView(next) {
      index = next;
      orbitAngle = 0;
      requestRender();
    },
    setDay(next) {
      day = next;
      targetColor.set(day ? "#8d9ba3" : "#0c1521");
      if (scene.background instanceof THREE.Color)
        scene.background.copy(targetColor);
      if (scene.fog) scene.fog.color.copy(targetColor);
      hemisphere.intensity = day ? 3.5 : 1.6;
      key.intensity = day ? 5 : 3.4;
      renderer.toneMappingExposure = day ? 1.1 : 0.95;
      model.warm.emissiveIntensity = day ? 0.06 : 0.48;
      model.light.color.set(day ? "#b9a68b" : "#f2cc8f");
      (ground.material as THREE.MeshStandardMaterial).color.set(
        day ? "#56616a" : "#0d1923",
      );
      requestRender();
    },
    setLowPower(next) {
      low = next;
      renderer.setPixelRatio(low ? 1 : Math.min(window.devicePixelRatio, 1.5));
      renderer.shadowMap.enabled = !low && !options.hero;
      resize();
    },
    orbit(direction) {
      orbitAngle += direction * 0.25;
      requestRender();
    },
    destroy() {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener("scroll", scroll);
      document.removeEventListener("visibilitychange", visibility);
      reduced.removeEventListener("change", requestRender);
      host.removeEventListener("pointermove", pointerMove);
      host.removeEventListener("pointerdown", pointerDown);
      host.removeEventListener("pointerup", pointerUp);
      host.removeEventListener("pointercancel", pointerUp);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          geometries.add(object.geometry);
          const material = object.material as THREE.Material | THREE.Material[];
          (Array.isArray(material) ? material : [material]).forEach((m) =>
            materials.add(m),
          );
        }
      });
      reflection.traverse((object) => {
        if (object instanceof THREE.Mesh)
          materials.add(object.material as THREE.Material);
      });
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      model.concreteTexture.dispose();
      environment?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
