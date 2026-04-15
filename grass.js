import * as THREE from 'three';

export function createForestGrass() {
    const grassGroup = new THREE.Group();

    const greenMaterial = new THREE.MeshStandardMaterial({
        color: 0x2f8d3f,
        roughness: 0.9,
        metalness: 0.0,
    });

    const darkGreenMaterial = new THREE.MeshStandardMaterial({
        color: 0x256c31,
        roughness: 0.95,
        metalness: 0.0,
    });

    const bladeCount = 16 + Math.floor(Math.random() * 10);

    for (let i = 0; i < bladeCount; i++) {
        const height = 7 + Math.random() * 6;
        const width = 0.6 + Math.random() * 0.6;
        const bladeGeo = new THREE.CylinderGeometry(0.08, width, height, 6);
        const material = Math.random() > 0.5 ? greenMaterial : darkGreenMaterial;
        const blade = new THREE.Mesh(bladeGeo, material);

        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 6;
        blade.position.set(Math.cos(angle) * radius, height / 2, Math.sin(angle) * radius);

        blade.rotation.z = (Math.random() - 0.5) * 0.45;
        blade.rotation.x = (Math.random() - 0.5) * 0.25;
        blade.rotation.y = Math.random() * Math.PI;

        grassGroup.add(blade);
    }

    grassGroup.userData.draggable = true;
    grassGroup.name = 'Grass';

    return grassGroup;
}
