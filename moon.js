import * as THREE from 'three';

/**
 * Cria a lua low-poly: esfera icosaedral com cara pixelada serena e halo de luar suave.
 * O grupo faz billboard na cena (lookAt camera) para a cara ficar sempre visível.
 * @returns {THREE.Group}
 */
export function createMoon() {
    const moonGroup = new THREE.Group();
    moonGroup.name = 'Moon';

    const radius = 46;

    // Material da esfera: branco-azulado frio, emissivo subtil (luar)
    const moonMaterial = new THREE.MeshStandardMaterial({
        color: 0xdde8ff,
        emissive: 0x8899cc,
        emissiveIntensity: 0.55,
        roughness: 0.55,
        metalness: 0.0,
        flatShading: true,
    });

    // === HALO DE LUAR (Sprite) ===
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
    grad.addColorStop(0, 'rgba(200, 220, 255, 0.90)');
    grad.addColorStop(0.30, 'rgba(140, 170, 240, 0.45)');
    grad.addColorStop(0.65, 'rgba(80, 110, 200, 0.15)');
    grad.addColorStop(1, 'rgba(40, 60, 160, 0)');
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
    halo.scale.set(radius * 7, radius * 7, 1);
    moonGroup.add(halo);

    moonGroup.userData.draggable = false;
    moonGroup.userData.ignoreSceneTools = true;
    moonGroup.userData.isMoon = true;

    return moonGroup;
}
