import * as THREE from 'three';

export function createTerrain(textureType = 'grass') {
    // Dimensões e subdivisões do terreno quadrado
    const worldWidth = 3000;  
    const worldDepth = 3000;  
    const segmentsX = 100;
    const segmentsZ = 100;

    const geometry = new THREE.PlaneGeometry(worldWidth, worldDepth, segmentsX, segmentsZ);
    geometry.rotateX(-Math.PI / 2);

    const positionAttribute = geometry.attributes.position;
    const vertexCount = positionAttribute.count;

    // Parâmetros para elevação das montanhas periféricas
    const maxElevation = 180;
    const valleyRadius = 800;
    const maxRadius = Math.min(worldWidth, worldDepth) / 2;

    for (let i = 0; i < vertexCount; i++) {
        const x = positionAttribute.getX(i);
        const z = positionAttribute.getZ(i);

        // Distância ao centro para manter o vale plano a meio
        const dist = Math.sqrt(x * x + z * z);

        let elevation = 0;

        if (dist > valleyRadius) {
            const t = Math.min(1, (dist - valleyRadius) / (maxRadius - valleyRadius));
            const intensity = t * t;

            // Relevo irregular nas montanhas
            elevation = (
                Math.sin(x * 0.02) * Math.cos(z * 0.02) * 40 +
                Math.sin(x * 0.05) * 20 +
                Math.cos(z * 0.08) * 10
            ) * intensity;

            elevation += intensity * maxElevation;
        }

        positionAttribute.setY(i, elevation);
    }

    geometry.computeVertexNormals();

    // Definição das configurações de textura e cor
    const textureConfigs = {
        grass: {
            color: 0x55aa55,
            roughness: 0.8,
            name: 'Relvosa'
        },
        sand: {
            color: 0xd4a574,
            roughness: 0.95,
            name: 'Areosa'
        },
        rocky: {
            color: 0x6b6b6b,
            roughness: 0.75,
            name: 'Pedrosa'
        },
        mixed: {
            color: 0x8b8b4e,
            roughness: 0.85,
            name: 'Mista'
        }
    };

    const config = textureConfigs[textureType] || textureConfigs.grass;

    const material = new THREE.MeshStandardMaterial({ 
        color: config.color, 
        roughness: config.roughness,
        flatShading: false
    });
    
    const terrainMesh = new THREE.Mesh(geometry, material);
    terrainMesh.userData.textureType = textureType;
    return terrainMesh;
}