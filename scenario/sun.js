import * as THREE from 'three';

/**
 * Cria o sol low-poly: esfera icosaedral com cara pixelada e halo brilhante.
 * O grupo faz billboard na cena (lookAt camera) para a cara ficar sempre visível.
 * @returns {THREE.Group}
 */
export function createSun() {
    const sunGroup = new THREE.Group();
    sunGroup.name = 'Sun';

    const radius = 58;

    // Material da esfera: amarelo solar com emissive forte
    const sunMaterial = new THREE.MeshStandardMaterial({
        color: 0xffdd00,
        emissive: 0xffaa00,
        emissiveIntensity: 1.2,
        roughness: 0.3,
        metalness: 0.0,
        flatShading: true,
    });

    // === HALO DE LUZ (Sprite) ===
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255, 240, 80, 0.95)');
    grad.addColorStop(0.25, 'rgba(255, 180, 20, 0.55)');
    grad.addColorStop(0.6, 'rgba(255, 100, 0, 0.18)');
    grad.addColorStop(1, 'rgba(255, 60, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    const haloTex = new THREE.CanvasTexture(canvas);
    const haloMat = new THREE.SpriteMaterial({
        map: haloTex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });
    const halo = new THREE.Sprite(haloMat);
    halo.scale.set(radius * 6.5, radius * 6.5, 1);
    sunGroup.add(halo);

    sunGroup.userData.draggable = false;
    sunGroup.userData.ignoreSceneTools = true;
    sunGroup.userData.isSun = true;

    return sunGroup;
}
