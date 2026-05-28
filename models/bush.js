import * as THREE from 'three';

// Materiais partilhados (Padrão Flyweight)
const twigMaterial = new THREE.MeshStandardMaterial({
    color: 0xbfa66a,
    roughness: 0.95,
    metalness: 0.0,
});

// Geometria base partilhada (Flyweight)
const baseTwigGeo = new THREE.CylinderGeometry(0.08, 0.14, 1, 6);

const up = new THREE.Vector3(0, 1, 0);

// Cria um arbusto seco com InstancedMesh para otimizar o desempenho
export function createBush() {
    const bushGroup = new THREE.Group();
    bushGroup.name = 'Bush';
    bushGroup.userData.draggable = true;

    const twigCount = 95 + Math.floor(Math.random() * 40);
    const bushRadius = 6.5 + Math.random() * 1.8;

    const instancedMesh = new THREE.InstancedMesh(baseTwigGeo, twigMaterial, twigCount);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < twigCount; i++) {
        const dir = new THREE.Vector3(
            Math.random() * 2 - 1,
            Math.random() * 0.9 + 0.1,
            Math.random() * 2 - 1
        ).normalize();

        const length = 1.6 + Math.random() * 2.2;
        const radial = bushRadius * (0.12 + Math.random() * 0.82);
        const jitter = new THREE.Vector3(
            (Math.random() - 0.5) * 1.1,
            Math.random() * 0.8,
            (Math.random() - 0.5) * 1.1
        );

        dummy.position.copy(dir).multiplyScalar(radial);
        dummy.position.y *= 0.62;
        dummy.position.add(jitter);

        // Inclinação dos ramos para fora e para cima
        const orientDir = dir.clone().lerp(up, 0.35).normalize();
        dummy.quaternion.setFromUnitVectors(up, orientDir);
        dummy.scale.set(1, length, 1);

        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
    bushGroup.add(instancedMesh);

    // Ajusta a base no chão (y = 0)
    const bbox = new THREE.Box3().setFromObject(bushGroup);
    bushGroup.position.y -= bbox.min.y;

    return bushGroup;
}
