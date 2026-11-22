"use client";

import { useEffect, useRef, useState } from "react";
import type { Material } from "three";

interface PadelCourt3DProps {
  turfColor: string;
  frameColor: string;
}

export default function PadelCourt3D({ turfColor, frameColor }: PadelCourt3DProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [unsupported, setUnsupported] = useState(false);

  useEffect(() => {
    setReady(false);
    setUnsupported(false);
    let disposed = false;
    let frameId = 0;
    let cleanup: (() => void) | undefined;
    import("three").then((THREE) => {
      if (disposed || !hostRef.current) return;
      try {
        const host = hostRef.current;
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#101820");
        const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
        camera.position.set(17, 14, 20);
        camera.lookAt(0, 1, 0);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.setClearColor("#101820");
        host.appendChild(renderer.domElement);

        const court = new THREE.Group();
        scene.add(court);
        scene.add(new THREE.HemisphereLight(0xffffff, 0x263238, 2.1));
        const key = new THREE.DirectionalLight(0xffffff, 2.5);
        key.position.set(-8, 16, 10);
        scene.add(key);

        const steel = new THREE.MeshStandardMaterial({ color: frameColor, metalness: 0.58, roughness: 0.34 });
        const turf = new THREE.MeshStandardMaterial({ color: turfColor, roughness: 0.88 });
        const glass = new THREE.MeshStandardMaterial({ color: 0x8ed8ef, transparent: true, opacity: 0.27, roughness: 0.12, metalness: 0.08, side: THREE.DoubleSide, depthWrite: false });
        const lineMat = new THREE.MeshStandardMaterial({ color: 0xf5f8fa, roughness: 0.82 });
        const netMat = new THREE.MeshStandardMaterial({ color: 0x202a31, roughness: 0.95 });
        const addBox = (w: number, h: number, d: number, x: number, y: number, z: number, material: Material) => {
          const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
          mesh.position.set(x, y, z);
          court.add(mesh);
          return mesh;
        };

        addBox(10.45, 0.14, 20.45, 0, -0.09, 0, steel);
        addBox(10, 0.025, 20, 0, 0, 0, turf);
        // Simplified court markings and center net.
        addBox(0.045, 0.018, 19.6, -4.15, 0.022, 0, lineMat);
        addBox(0.045, 0.018, 19.6, 4.15, 0.022, 0, lineMat);
        addBox(8.3, 0.018, 0.045, 0, 0.022, -9.8, lineMat);
        addBox(8.3, 0.018, 0.045, 0, 0.022, 9.8, lineMat);
        addBox(8.3, 0.018, 0.035, 0, 0.023, 0, lineMat);
        addBox(0.035, 0.018, 4.5, 0, 0.023, -3.7, lineMat);
        addBox(0.035, 0.018, 4.5, 0, 0.023, 3.7, lineMat);
        addBox(10, 0.72, 0.06, 0, 0.39, 0, netMat);
        addBox(10, 0.07, 0.1, 0, 0.77, 0, steel);

        // Conceptual glazed lower panels and upper mesh enclosure.
        const wallH = 3;
        addBox(10, 1.25, 0.055, 0, 0.64, -10, glass);
        addBox(10, 1.25, 0.055, 0, 0.64, 10, glass);
        addBox(0.055, 1.25, 20, -5, 0.64, 0, glass);
        addBox(0.055, 1.25, 20, 5, 0.64, 0, glass);

        const railY = [1.28, 2.98];
        for (const y of railY) {
          addBox(0.075, 0.075, 20.1, -5, y, 0, steel);
          addBox(0.075, 0.075, 20.1, 5, y, 0, steel);
          addBox(10.1, 0.075, 0.075, 0, y, -10, steel);
          addBox(10.1, 0.075, 0.075, 0, y, 10, steel);
        }
        for (let z = -10; z <= 10.001; z += 1.25) {
          addBox(0.065, wallH, 0.065, -5, wallH / 2, z, steel);
          addBox(0.065, wallH, 0.065, 5, wallH / 2, z, steel);
        }
        for (let x = -5; x <= 5.001; x += 1.25) {
          addBox(0.065, wallH, 0.065, x, wallH / 2, -10, steel);
          addBox(0.065, wallH, 0.065, x, wallH / 2, 10, steel);
        }
        for (let y = 1.48; y < 2.9; y += 0.25) {
          addBox(0.025, 0.025, 20, -5.04, y, 0, steel);
          addBox(0.025, 0.025, 20, 5.04, y, 0, steel);
          addBox(10, 0.025, 0.025, 0, y, -10.04, steel);
          addBox(10, 0.025, 0.025, 0, y, 10.04, steel);
        }
        const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: 0x101820, roughness: 1 }));
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.2;
        scene.add(ground);

        const resize = () => {
          const width = Math.max(host.clientWidth, 1);
          const height = Math.max(host.clientHeight, 1);
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        };
        const observer = new ResizeObserver(resize);
        observer.observe(host);
        resize();

        let dragging = false;
        let previousX = 0;
        let previousY = 0;
        const down = (event: PointerEvent) => {
          dragging = true;
          previousX = event.clientX;
          previousY = event.clientY;
          renderer.domElement.setPointerCapture(event.pointerId);
        };
        const move = (event: PointerEvent) => {
          if (!dragging) return;
          court.rotation.y += (event.clientX - previousX) * 0.009;
          court.rotation.x = Math.max(-0.25, Math.min(0.25, court.rotation.x + (event.clientY - previousY) * 0.003));
          previousX = event.clientX;
          previousY = event.clientY;
        };
        const up = () => { dragging = false; };
        const wheel = (event: WheelEvent) => {
          event.preventDefault();
          camera.position.multiplyScalar(event.deltaY > 0 ? 1.06 : 0.94);
          camera.position.clampLength(15, 38);
        };
        renderer.domElement.addEventListener("pointerdown", down);
        renderer.domElement.addEventListener("pointermove", move);
        renderer.domElement.addEventListener("pointerup", up);
        renderer.domElement.addEventListener("pointercancel", up);
        renderer.domElement.addEventListener("wheel", wheel, { passive: false });
        const render = () => {
          if (disposed) return;
          frameId = requestAnimationFrame(render);
          renderer.render(scene, camera);
        };
        render();
        setReady(true);

        cleanup = () => {
          observer.disconnect();
          renderer.domElement.removeEventListener("pointerdown", down);
          renderer.domElement.removeEventListener("pointermove", move);
          renderer.domElement.removeEventListener("pointerup", up);
          renderer.domElement.removeEventListener("pointercancel", up);
          renderer.domElement.removeEventListener("wheel", wheel);
          scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
              object.geometry.dispose();
              const materials = Array.isArray(object.material) ? object.material : [object.material];
              materials.forEach((material) => material.dispose());
            }
          });
          renderer.dispose();
          renderer.domElement.remove();
        };
      } catch {
        setUnsupported(true);
      }
    }).catch(() => setUnsupported(true));
    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      cleanup?.();
    };
  }, [turfColor, frameColor]);

  return (
    <div className="relative">
      <div ref={hostRef} className="h-[250px] w-full overflow-hidden rounded-2xl bg-[#101820] touch-none sm:h-[320px]" aria-label="Интерактивная трёхмерная схема падел-корта" />
      {!ready && !unsupported && <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs font-semibold text-white/60">Загружаем 3D-модель…</div>}
      {unsupported && <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[#101820] px-6 text-center text-sm text-white/75">3D-просмотр недоступен в этом браузере. Выбранные цвета сохранены в запросе.</div>}
      {ready && <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-[10px] font-semibold text-white/80">Потяните, чтобы повернуть · прокрутите для масштаба</div>}
    </div>
  );
}
