import * as THREE from 'three';

// Shared Materials (Flyweight pattern - instantiated once globally)
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

// Shared Base Geometry (Flyweight pattern - instantiated once globally)
// Pivot is translated to the bottom so that Y-scaling scales upwards from the ground.
const baseBladeGeo = new THREE.CylinderGeometry(0.08, 1, 1, 6);
baseBladeGeo.translate(0, 0.5, 0);

/**
 * Creates low-poly grass using the Flyweight pattern with InstancedMesh to optimize
 * memory usage, rendering performance (draw calls), and creation speed.
 * @returns {THREE.Group}
 */
export function createForestGrass() {
    const grassGroup = new THREE.Group();
    grassGroup.name = 'Grass';
    grassGroup.userData.draggable = true;

    const bladeCount = 16 + Math.floor(Math.random() * 10);

    // Split blades between green and dark green materials
    const greenIndices = [];
    const darkGreenIndices = [];
    for (let i = 0; i < bladeCount; i++) {
        if (Math.random() > 0.5) {
            greenIndices.push(i);
        } else {
            darkGreenIndices.push(i);
        }
    }

    const dummy = new THREE.Object3D();

    const createInstancedBlades = (indices, material) => {
        if (indices.length === 0) return null;
        
        const instancedMesh = new THREE.InstancedMesh(baseBladeGeo, material, indices.length);
        
        indices.forEach((originalIndex, i) => {
            const height = 7 + Math.random() * 6;
            const width = 0.6 + Math.random() * 0.6;
            
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 6;

            dummy.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
            dummy.scale.set(width, height, width);

            // Apply rotations
            dummy.rotation.set(0, 0, 0);
            dummy.rotation.z = (Math.random() - 0.5) * 0.45;
            dummy.rotation.x = (Math.random() - 0.5) * 0.25;
            dummy.rotation.y = Math.random() * Math.PI;

            dummy.updateMatrix();
            instancedMesh.setMatrixAt(i, dummy.matrix);
        });

        instancedMesh.instanceMatrix.needsUpdate = true;
        return instancedMesh;
    };

    const greenMesh = createInstancedBlades(greenIndices, greenMaterial);
    if (greenMesh) grassGroup.add(greenMesh);

    const darkGreenMesh = createInstancedBlades(darkGreenIndices, darkGreenMaterial);
    if (darkGreenMesh) grassGroup.add(darkGreenMesh);

    return grassGroup;
}
