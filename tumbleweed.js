import * as THREE from 'three';

export function createTumbleweed() {
    const tumbleweed = new THREE.Group();

    const strandMaterial = new THREE.MeshStandardMaterial({
        color: 0xd2bc86,
        roughness: 0.92,
        metalness: 0.0,
    });

    const baseRadius = 8 + Math.random() * 2;
    const strandCount = 42 + Math.floor(Math.random() * 20);

    for (let i = 0; i < strandCount; i++) {
        const ringRadius = baseRadius * (0.72 + Math.random() * 0.35);
        const tubeRadius = 0.07 + Math.random() * 0.05;
        const arc = Math.PI * (0.85 + Math.random() * 0.7);

        const strandGeo = new THREE.TorusGeometry(ringRadius, tubeRadius, 5, 26, arc);
        const strand = new THREE.Mesh(strandGeo, strandMaterial);

        strand.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        strand.position.set(
            (Math.random() - 0.5) * 2.1,
            (Math.random() - 0.5) * 2.1,
            (Math.random() - 0.5) * 2.1
        );

        tumbleweed.add(strand);
    }

    const twigGeo = new THREE.CylinderGeometry(0.05, 0.05, 1, 5);
    const up = new THREE.Vector3(0, 1, 0);
    const twigCount = 36 + Math.floor(Math.random() * 18);

    for (let i = 0; i < twigCount; i++) {
        const twig = new THREE.Mesh(twigGeo, strandMaterial);
        const dir = new THREE.Vector3(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1
        ).normalize();

        const dist = baseRadius * (0.35 + Math.random() * 0.7);
        twig.position.copy(dir).multiplyScalar(dist);

        const orientDir = dir.clone().lerp(up, 0.15).normalize();
        twig.quaternion.setFromUnitVectors(up, orientDir);
        twig.scale.y = 2.2 + Math.random() * 3.2;

        tumbleweed.add(twig);
    }

    const bbox = new THREE.Box3().setFromObject(tumbleweed);
    tumbleweed.position.y -= bbox.min.y;

    tumbleweed.userData.draggable = true;
    tumbleweed.userData.isTumbleweed = true;
    tumbleweed.userData.rollAxis = new THREE.Vector3(Math.random() * 2 - 1, 0, Math.random() * 2 - 1).normalize();
    tumbleweed.userData.rollSpeed = 0.03 + Math.random() * 0.03;
    tumbleweed.userData.wind = new THREE.Vector2(0.22 + Math.random() * 0.16, (Math.random() - 0.5) * 0.09);
    // Ligeiramente enterrada no terreno para evitar efeito de flutuar.
    tumbleweed.userData.groundOffset = -3.0;
    tumbleweed.userData.jumpHeight = 0;
    tumbleweed.userData.jumpVelocity = 0;
    tumbleweed.userData.gravity = 0.08;
    tumbleweed.userData.bigJumpChance = 0.22;
    tumbleweed.userData.nextJumpAt = Date.now() + 2000 + Math.random() * 3000;
    tumbleweed.name = 'Tumbleweed';

    return tumbleweed;
}
