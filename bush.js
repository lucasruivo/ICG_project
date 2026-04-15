import * as THREE from 'three';

export function createBush() {
    const bushGroup = new THREE.Group();

    const twigMaterial = new THREE.MeshStandardMaterial({
        color: 0xbfa66a,
        roughness: 0.95,
        metalness: 0.0,
    });

    const twigGeo = new THREE.CylinderGeometry(0.08, 0.14, 1, 6);
    const up = new THREE.Vector3(0, 1, 0);

    const twigCount = 95 + Math.floor(Math.random() * 40);
    const bushRadius = 6.5 + Math.random() * 1.8;

    for (let i = 0; i < twigCount; i++) {
        const twig = new THREE.Mesh(twigGeo, twigMaterial);

        // Apenas hemisferio superior: vira o "arbusto" em tufo de erva seca.
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

        twig.position.copy(dir).multiplyScalar(radial);
        twig.position.y *= 0.62;
        twig.position.add(jitter);

        // Inclina para fora, mas com tendencia para cima como capim seco.
        const orientDir = dir.clone().lerp(up, 0.35).normalize();
        twig.quaternion.setFromUnitVectors(up, orientDir);
        twig.scale.y = length;

        bushGroup.add(twig);
    }

    // Assentar a base exatamente em y=0
    const bbox = new THREE.Box3().setFromObject(bushGroup);
    bushGroup.position.y -= bbox.min.y;

    bushGroup.userData.draggable = true;
    bushGroup.name = 'Bush';

    return bushGroup;
}
