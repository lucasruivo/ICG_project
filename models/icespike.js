import * as THREE from 'three';

// Cria um cluster de espigões de gelo (IceSpike)
export function createIceSpike() {
    const iceGroup = new THREE.Group();

    // Material físico para simular gelo translúcido
    const iceMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x8be4f0,
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.9,
        transmission: 0.85,
        thickness: 8.0,
        ior: 1.31,
        flatShading: true,
        side: THREE.DoubleSide
    });

    const rand = (min, max) => THREE.MathUtils.randFloat(min, max);

    // Cria cone com deformação nas faces para simular cristal natural
    function createSpikeGeometry(radius, height, radialSegments, heightSegments) {
        const geo = new THREE.ConeGeometry(radius, height, radialSegments, heightSegments);
        
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            let x = pos.getX(i);
            let y = pos.getY(i);
            let z = pos.getZ(i);

            // Não deforma as extremidades (ponta e base)
            const halfHeight = height / 2;
            if (y < halfHeight - 1 && y > -halfHeight + 1) {
                const angle = (y / height) * Math.PI * 4;
                const jitter = radius * 0.12;
                x += Math.sin(angle) * jitter;
                z += Math.cos(angle * 1.3) * jitter;
            }
            pos.setXYZ(i, x, y, z);
        }
        geo.computeVertexNormals();
        return geo;
    }

    // Espigão central
    const mainRadius = rand(7.0, 9.0);
    const mainHeight = rand(65.0, 80.0);
    const mainSpikeGeo = createSpikeGeometry(mainRadius, mainHeight, 5, 4);
    const mainSpike = new THREE.Mesh(mainSpikeGeo, iceMaterial);
    
    mainSpike.position.y = mainHeight / 2;
    iceGroup.add(mainSpike);

    // Espigões secundários circundantes
    const numSubSpikes = THREE.MathUtils.randInt(4, 7);
    for (let i = 0; i < numSubSpikes; i++) {
        const subRadius = mainRadius * rand(0.4, 0.6);
        const subHeight = mainHeight * rand(0.4, 0.65);
        
        const subSpikeGeo = createSpikeGeometry(subRadius, subHeight, 5, 3);
        const subSpike = new THREE.Mesh(subSpikeGeo, iceMaterial);
        subSpike.name = 'IceSubSpike';

        const angle = (i / numSubSpikes) * Math.PI * 2 + rand(-0.3, 0.3);
        const distance = mainRadius * rand(0.9, 1.3);
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;

        subSpike.position.set(x, subHeight / 2, z);

        // Inclinação lateral
        subSpike.rotation.z = -Math.cos(angle) * rand(0.15, 0.35);
        subSpike.rotation.x = Math.sin(angle) * rand(0.15, 0.35);
        subSpike.rotation.y = rand(0, Math.PI * 2);

        iceGroup.add(subSpike);
    }

    // Ajusta a altura da base ao chão
    iceGroup.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(iceGroup);
    iceGroup.position.y -= box.min.y;

    iceGroup.name = "IceSpike";
    iceGroup.userData.draggable = true;
    // Ligeiro afundamento para melhor integração com o terreno
    iceGroup.userData.terrainSurfaceOffset = -2.5; 
    iceGroup.userData.collisionCircles = [
        { x: 0, z: 0, r: mainRadius * 1.5 }
    ];

    return iceGroup;
}
