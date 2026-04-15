import * as THREE from 'three';

export function createTerrain() {
    // 1. Dimensões: Mais largo pros dois lados (ex: 2000x1200)
    const worldWidth = 3000;  
    const worldDepth = 3000;  
    const segmentsX = 100; // Mais segmentos para suavizar as montanhas
    const segmentsZ = 100; // igual a segmentsX porque o terreno é agora quadrado

    const geometry = new THREE.PlaneGeometry(worldWidth, worldDepth, segmentsX, segmentsZ);
    geometry.rotateX(-Math.PI / 2);

    const positionAttribute = geometry.attributes.position;
    const vertexCount = positionAttribute.count;

    // 2. Parâmetros de relevo
    const maxElevation = 180; // Altura máxima nas bordas
    const valleyRadius = 800; // Raio da zona plana no centro
    const maxRadius = Math.min(worldWidth, worldDepth) / 2; // até às bordas do terreno

    for (let i = 0; i < vertexCount; i++) {
        const x = positionAttribute.getX(i);
        const z = positionAttribute.getZ(i);

        // Distância radial ao centro para um terreno simétrico em todos os lados
        const dist = Math.sqrt(x * x + z * z);

        let elevation = 0;

        if (dist > valleyRadius) {
            const t = Math.min(1, (dist - valleyRadius) / (maxRadius - valleyRadius));
            const intensity = t * t; // cresce suavemente até 1

            // Relevo pseudo-aleatório mas simétrico em torno do centro
            elevation = (
                Math.sin(x * 0.02) * Math.cos(z * 0.02) * 40 +
                Math.sin(x * 0.05) * 20 +
                Math.cos(z * 0.08) * 10
            ) * intensity;

            // Elevação base para criar o "anel" de montanhas à volta do vale
            elevation += intensity * maxElevation;
        }

        positionAttribute.setY(i, elevation);
    }

    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({ 
        color: 0x55aa55, 
        roughness: 0.8,
        flatShading: false // Para as montanhas parecerem suaves
    });
    
    return new THREE.Mesh(geometry, material);
}