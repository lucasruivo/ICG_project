import * as THREE from 'three';

/**
 * Cria um cluster de espigões de gelo (IceSpike).
 * @returns {THREE.Group}
 */
export function createIceSpike() {
    const iceGroup = new THREE.Group();

    // Material de gelo/cristal translúcido e brilhante
    const iceMaterial = new THREE.MeshStandardMaterial({
        color: 0x8be4f0,      // Cor azulada/ciano de gelo
        roughness: 0.15,      // Superfície brilhante e polida
        metalness: 0.1,
        transparent: true,
        opacity: 0.75,        // Translúcido
        flatShading: true,    // Flat shading para evidenciar as faces do cristal
        side: THREE.DoubleSide // Permite ver através
    });

    const rand = (min, max) => THREE.MathUtils.randFloat(min, max);

    // Função auxiliar para gerar um cone deformado (espigão de gelo)
    function createSpikeGeometry(radius, height, radialSegments, heightSegments) {
        const geo = new THREE.ConeGeometry(radius, height, radialSegments, heightSegments);
        
        // Deforma ligeiramente os vértices para criar facetas irregulares (estilo cristalino natural)
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            let x = pos.getX(i);
            let y = pos.getY(i);
            let z = pos.getZ(i);

            // Não deformar a ponta do cone (onde y é próximo de height/2) nem a base extrema
            const halfHeight = height / 2;
            if (y < halfHeight - 1 && y > -halfHeight + 1) {
                // Fator de perturbação
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

    // Criar o espigão central principal (grande)
    const mainRadius = rand(7.0, 9.0);
    const mainHeight = rand(65.0, 80.0);
    const mainSpikeGeo = createSpikeGeometry(mainRadius, mainHeight, 5, 4);
    const mainSpike = new THREE.Mesh(mainSpikeGeo, iceMaterial);
    
    // Posiciona e adiciona o espigão principal
    mainSpike.position.y = mainHeight / 2;
    iceGroup.add(mainSpike);

    // Adicionar múltiplos espigões secundários ao redor
    const numSubSpikes = THREE.MathUtils.randInt(4, 7);
    for (let i = 0; i < numSubSpikes; i++) {
        const subRadius = mainRadius * rand(0.4, 0.6);
        const subHeight = mainHeight * rand(0.4, 0.65);
        
        const subSpikeGeo = createSpikeGeometry(subRadius, subHeight, 5, 3);
        const subSpike = new THREE.Mesh(subSpikeGeo, iceMaterial);

        // Posiciona ao redor do espigão central
        const angle = (i / numSubSpikes) * Math.PI * 2 + rand(-0.3, 0.3);
        const distance = mainRadius * rand(0.9, 1.3);
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;

        subSpike.position.set(x, subHeight / 2, z);

        // Inclina o espigão secundário ligeiramente para fora
        subSpike.rotation.z = -Math.cos(angle) * rand(0.15, 0.35);
        subSpike.rotation.x = Math.sin(angle) * rand(0.15, 0.35);
        subSpike.rotation.y = rand(0, Math.PI * 2);

        iceGroup.add(subSpike);
    }

    // Alinha a base do grupo a y = 0
    iceGroup.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(iceGroup);
    iceGroup.position.y -= box.min.y;

    // Configurações e propriedades do grupo para a cena
    iceGroup.name = "IceSpike";
    iceGroup.userData.draggable = true;
    // Ligeiro afundamento no terreno para encaixe estético perfeito
    iceGroup.userData.terrainSurfaceOffset = -2.5; 
    iceGroup.userData.collisionCircles = [
        { x: 0, z: 0, r: mainRadius * 1.5 }
    ];

    return iceGroup;
}
