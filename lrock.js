import * as THREE from 'three';

/**
 * Cria uma pedra de tamanho variável.
 * @param {string} size  'small' | 'medium' | 'large'
 * @returns {THREE.Group}
 */
export function createRock(size = 'medium') {
    const rockGroup = new THREE.Group();

    const stoneMaterial = new THREE.MeshStandardMaterial({
        color: 0xb0a8a0,
        roughness: 0.85,
        metalness: 0.0,
        flatShading: true,
    });

    function createLowPolyChunk(radius) {
        // Sem deformacao por vertice para manter faces planas e regulares.
        const geo = new THREE.IcosahedronGeometry(radius, 0);
        geo.computeVertexNormals();
        return geo;
    }

    const chunks = [
        { radius: 13.5, offset: new THREE.Vector3(-9, 0, -1), scale: new THREE.Vector3(1.2, 0.95, 1.05) },
        { radius: 12.0, offset: new THREE.Vector3(9, 0, 2), scale: new THREE.Vector3(1.05, 0.9, 1.2) },
        { radius: 9.5, offset: new THREE.Vector3(0, 0, 5.8), scale: new THREE.Vector3(0.95, 0.85, 0.92) },
    ];

    const chunkCountBySize = { small: 1, medium: 2, large: 3 };
    const chunkCount = chunkCountBySize[size] ?? 3;
    const selectedChunks = chunks.slice(0, chunkCount);

    for (const chunk of selectedChunks) {
        const mesh = new THREE.Mesh(createLowPolyChunk(chunk.radius), stoneMaterial);
        mesh.scale.copy(chunk.scale);
        mesh.position.copy(chunk.offset);

        // Faz cada bloco assentar no chao local em y=0 (sem ficar afundado).
        mesh.updateMatrixWorld(true);
        const meshBox = new THREE.Box3().setFromObject(mesh);
        mesh.position.y -= meshBox.min.y;

        rockGroup.add(mesh);
    }

    // Assenta o conjunto no chao mantendo o volume agrupado.
    const box = new THREE.Box3().setFromObject(rockGroup);
    rockGroup.position.y -= box.min.y;

    // Escala global conforme o tamanho pedido
    const scales = { small: 0.8, medium: 1.8, large: 4.5 };
    const s = scales[size] ?? 4.5;
    rockGroup.scale.setScalar(s);

    rockGroup.userData.draggable = true;
    rockGroup.name = 'Rock';

    return rockGroup;
}
