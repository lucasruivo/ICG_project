import * as THREE from 'three';

// Materiais partilhados (Padrão Flyweight)
const strandMaterial = new THREE.MeshStandardMaterial({
    color: 0xd2bc86,
    roughness: 0.92,
    metalness: 0.0,
});

// Geometrias partilhadas (Padrão Flyweight)
const baseTorusGeo = new THREE.TorusGeometry(1, 0.012, 5, 26, Math.PI * 1.2);
const baseTwigGeo = new THREE.CylinderGeometry(0.05, 0.05, 1, 5);

const up = new THREE.Vector3(0, 1, 0);

// Cria tumbleweed com InstancedMesh para otimizar desempenho
export function createTumbleweed() {
    const tumbleweed = new THREE.Group();
    tumbleweed.name = 'Tumbleweed';
    tumbleweed.userData.draggable = true;
    tumbleweed.userData.isTumbleweed = true;

    const baseRadius = 8 + Math.random() * 2;
    const strandCount = 42 + Math.floor(Math.random() * 20);

    // Ramos curvos (Torus)
    const torusMesh = new THREE.InstancedMesh(baseTorusGeo, strandMaterial, strandCount);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < strandCount; i++) {
        const ringRadius = baseRadius * (0.72 + Math.random() * 0.35);

        dummy.position.set(
            (Math.random() - 0.5) * 2.1,
            (Math.random() - 0.5) * 2.1,
            (Math.random() - 0.5) * 2.1
        );

        dummy.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        dummy.scale.set(ringRadius, ringRadius, ringRadius);

        dummy.updateMatrix();
        torusMesh.setMatrixAt(i, dummy.matrix);
    }
    torusMesh.instanceMatrix.needsUpdate = true;
    tumbleweed.add(torusMesh);

    // Ramos retos (Cilindros)
    const twigCount = 36 + Math.floor(Math.random() * 18);
    const twigMesh = new THREE.InstancedMesh(baseTwigGeo, strandMaterial, twigCount);

    for (let i = 0; i < twigCount; i++) {
        const dir = new THREE.Vector3(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1
        ).normalize();

        const dist = baseRadius * (0.35 + Math.random() * 0.7);
        dummy.position.copy(dir).multiplyScalar(dist);

        const orientDir = dir.clone().lerp(up, 0.15).normalize();
        dummy.quaternion.setFromUnitVectors(up, orientDir);

        const length = 2.2 + Math.random() * 3.2;
        dummy.scale.set(1, length, 1);

        dummy.updateMatrix();
        twigMesh.setMatrixAt(i, dummy.matrix);
    }
    twigMesh.instanceMatrix.needsUpdate = true;
    tumbleweed.add(twigMesh);

    // Ajusta a altura da base ao chão
    const bbox = new THREE.Box3().setFromObject(tumbleweed);
    tumbleweed.position.y -= bbox.min.y;

    // Propriedades físicas e de comportamento
    tumbleweed.userData.rollAxis = new THREE.Vector3(Math.random() * 2 - 1, 0, Math.random() * 2 - 1).normalize();
    tumbleweed.userData.rollSpeed = 0.03 + Math.random() * 0.03;
    tumbleweed.userData.wind = new THREE.Vector2(0.22 + Math.random() * 0.16, (Math.random() - 0.5) * 0.09);
    // Ligeiramente enterrado no terreno para evitar efeito flutuante
    tumbleweed.userData.terrainSurfaceOffset = -3.0;
    tumbleweed.userData.jumpHeight = 0;
    tumbleweed.userData.jumpVelocity = 0;
    tumbleweed.userData.gravity = 0.08;
    tumbleweed.userData.bigJumpChance = 0.22;
    tumbleweed.userData.nextJumpAt = Date.now() + 2000 + Math.random() * 3000;

    return tumbleweed;
}
