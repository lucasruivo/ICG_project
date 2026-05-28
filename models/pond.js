import * as THREE from 'three';

export function createPond() {
    const pond = new THREE.Group();
    pond.name = 'Pond';

    const radius = 130;
    pond.userData.pondRadius = radius;
    pond.userData.pondDepth = 64; 

    // Materiais
    const shoreMaterial = new THREE.MeshStandardMaterial({
        color: 0xb59975,
        roughness: 0.9,
        metalness: 0.0,
        flatShading: true
    });

    const bottomMaterial = new THREE.MeshStandardMaterial({
        color: 0x1e3a8a,
        roughness: 0.95,
        metalness: 0.0,
        flatShading: true,
        side: THREE.DoubleSide
    });

    const waterMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x0ea5e9,
        roughness: 0.05,
        metalness: 0.1,
        transparent: true,
        opacity: 0.95,
        transmission: 0.8,
        thickness: 15.0,
        ior: 1.333,
        side: THREE.DoubleSide
    });

    const rockMaterial = new THREE.MeshStandardMaterial({
        color: 0x52525b,
        roughness: 0.85,
        metalness: 0.0,
        flatShading: true
    });

    const reedMaterial = new THREE.MeshStandardMaterial({
        color: 0x3f6212,
        roughness: 0.9,
        metalness: 0.0,
        flatShading: true
    });

    // Bacia do fundo (hemi-esfera cortada e escalada)
    const thetaStart = 1.91; 
    const thetaLength = Math.PI - thetaStart;
    const bowlGeo = new THREE.SphereGeometry(radius - 2, 24, 16, 0, Math.PI * 2, thetaStart, thetaLength);
    bowlGeo.scale(1, 60 / (radius - 2), 1);
    const bowl = new THREE.Mesh(bowlGeo, bottomMaterial);
    bowl.name = 'PondBowl';
    bowl.position.y = 0; 
    pond.add(bowl);

    // Margem irregular de blocos de barro
    const collisionCircles = [];
    const numShoreBlocks = 36;
    for (let i = 0; i < numShoreBlocks; i++) {
        const angle = (i / numShoreBlocks) * Math.PI * 2;
        const noiseRadius = radius + (Math.sin(angle * 4) + Math.cos(angle * 6)) * 6;
        const x = Math.cos(angle) * noiseRadius;
        const z = Math.sin(angle) * noiseRadius;

        const blockW = 22 + Math.random() * 8;
        const blockH = 22 + Math.random() * 5;
        const blockD = 22 + Math.random() * 8;

        const borderMesh = new THREE.Mesh(
            new THREE.BoxGeometry(blockW, blockH, blockD),
            shoreMaterial
        );
        borderMesh.position.set(x, blockH / 2 - 35, z);
        borderMesh.rotation.set(
            (Math.random() - 0.5) * 0.1,
            -angle + (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.1
        );
        pond.add(borderMesh);

        // Círculos de colisão para cada bloco da margem
        collisionCircles.push({
            x: x,
            z: z,
            r: Math.max(blockW, blockD) * 0.45
        });
    }

    // Superfície da água
    const waterGeo = new THREE.CircleGeometry(radius - 2, 32);
    waterGeo.rotateX(-Math.PI / 2);
    const water = new THREE.Mesh(waterGeo, waterMaterial);
    water.name = 'Water';
    water.position.y = -20;
    pond.add(water);

    // Guarda referência da geometria para animação das ondas
    pond.userData.waterGeometry = waterGeo;

    // Rochas dentro do lago
    const rock1 = new THREE.Mesh(new THREE.BoxGeometry(32, 75, 24), rockMaterial);
    rock1.position.set(-36, -22.5, 20);
    rock1.rotation.set(0.1, 0.4, -0.15);
    pond.add(rock1);

    const rock2 = new THREE.Mesh(new THREE.BoxGeometry(26, 70, 20), rockMaterial);
    rock2.position.set(30, -25, -26);
    rock2.rotation.set(-0.15, -0.3, 0.2);
    pond.add(rock2);

    // Círculos de colisão para as rochas internas
    collisionCircles.push({
        x: -36,
        z: 20,
        r: 15
    });
    collisionCircles.push({
        x: 30,
        z: -26,
        r: 13
    });

    // Plantas e juncos
    const reedGeo = new THREE.CylinderGeometry(0.4, 0.7, 68, 4);
    reedGeo.translate(0, 34, 0); 

    const reedClusters = [
        [-54, -13], [-32, 38], [19, 45], [38, -13], [10, -54], [-10, -29]
    ];

    reedClusters.forEach(pos => {
        const count = 2 + Math.floor(Math.random() * 3);
        for (let j = 0; j < count; j++) {
            const reed = new THREE.Mesh(reedGeo, reedMaterial);
            const rx = pos[0] + (Math.random() - 0.5) * 8;
            const rz = pos[1] + (Math.random() - 0.5) * 8;
            
            reed.position.set(rx, -60, rz);
            reed.rotation.set(
                (Math.random() - 0.5) * 0.25,
                Math.random() * Math.PI,
                (Math.random() - 0.5) * 0.25
            );
            const s = 0.7 + Math.random() * 0.5;
            reed.scale.set(s, s, s);
            pond.add(reed);
        }
    });

    pond.userData.draggable = true;
    pond.userData.collisionCircles = collisionCircles;

    return pond;
}
