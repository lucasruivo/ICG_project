import * as THREE from 'three';

export function createPond() {
    const pond = new THREE.Group();
    pond.name = 'Pond';

    const radius = 130;
    pond.userData.pondRadius = radius;
    pond.userData.pondDepth = 64; // Maximum depth in the center (deeper basin)

    // --- MATERIALS ---
    // Shore Material (Sandy/clay brown, high roughness)
    const shoreMaterial = new THREE.MeshStandardMaterial({
        color: 0xb59975,
        roughness: 0.9,
        metalness: 0.0,
        flatShading: true
    });

    // Dark Muddy Bottom (Visible under the transparent water, covers the terrain)
    const bottomMaterial = new THREE.MeshStandardMaterial({
        color: 0x1e3a8a, // Deep blue-tinted muddy color
        roughness: 0.95,
        metalness: 0.0,
        flatShading: true,
        side: THREE.DoubleSide
    });

    // Water Material (Glossy, transparent blue)
    const waterMaterial = new THREE.MeshStandardMaterial({
        color: 0x0ea5e9, // Bright sky blue
        roughness: 0.08,
        metalness: 0.1,
        transparent: true,
        opacity: 0.82,
        side: THREE.DoubleSide
    });

    // Rocks Material (Dark grey stone)
    const rockMaterial = new THREE.MeshStandardMaterial({
        color: 0x52525b,
        roughness: 0.85,
        metalness: 0.0,
        flatShading: true
    });

    // Reed/Plant Material (Vibrant green)
    const reedMaterial = new THREE.MeshStandardMaterial({
        color: 0x3f6212,
        roughness: 0.9,
        metalness: 0.0,
        flatShading: true
    });

    // --- 1. THE BOTTOM BASIN (Muddy Hemisphere/Bowl - Cut at the top) ---
    // Creates a physical solid bowl that starts at the water level (y = -20)
    // and curves down to the floor (y = -60), sealing the deep water area.
    const thetaStart = 1.91; // ~109.5 degrees, cutting off the top part of the sphere
    const thetaLength = Math.PI - thetaStart;
    const bowlGeo = new THREE.SphereGeometry(radius - 2, 24, 16, 0, Math.PI * 2, thetaStart, thetaLength);
    // Scale Y so the bowl goes down from -20 to -60 (total depth of 60 relative to origin)
    bowlGeo.scale(1, 60 / (radius - 2), 1);
    const bowl = new THREE.Mesh(bowlGeo, bottomMaterial);
    bowl.name = 'PondBowl';
    bowl.position.y = 0; // Starts from water level (y = -20 after scaling) and curves down
    pond.add(bowl);

    // --- 2. ORGANIC / IRREGULAR SHORE ---
    // Made by arranging 36 overlapping sand-brown cubes around the perimeter.
    const collisionCircles = [];
    const numShoreBlocks = 36;
    for (let i = 0; i < numShoreBlocks; i++) {
        const angle = (i / numShoreBlocks) * Math.PI * 2;
        // Generate noise for irregular/organic look matching the clay border in the image
        const noiseRadius = radius + (Math.sin(angle * 4) + Math.cos(angle * 6)) * 6;
        const x = Math.cos(angle) * noiseRadius;
        const z = Math.sin(angle) * noiseRadius;

        // Border block scale and geometry
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

        // Add a collision circle for each perimeter block
        collisionCircles.push({
            x: x,
            z: z,
            r: Math.max(blockW, blockD) * 0.45
        });
    }

    // --- 3. DYNAMIC WATER SURFACE ---
    // Divided CircleGeometry so we can animate vertices in the wave loop.
    // Placed higher than the floor (y = 2.5), but below the shore blocks.
    const waterGeo = new THREE.CircleGeometry(radius - 2, 32);
    waterGeo.rotateX(-Math.PI / 2);
    const water = new THREE.Mesh(waterGeo, waterMaterial);
    water.name = 'Water';
    water.position.y = -20;
    pond.add(water);

    // Save reference in userData so index.html can animate it
    pond.userData.waterGeometry = waterGeo;

    // --- 4. STONE/ROCKS INSIDE THE POND ---
    // Rock 1 (Large, left - starts on the floor at y=-60 and sticks out of water)
    const rock1 = new THREE.Mesh(new THREE.BoxGeometry(32, 75, 24), rockMaterial);
    rock1.position.set(-36, -22.5, 20);
    rock1.rotation.set(0.1, 0.4, -0.15);
    pond.add(rock1);

    // Rock 2 (Medium-large, right - starts on the floor at y=-60 and sticks out of water)
    const rock2 = new THREE.Mesh(new THREE.BoxGeometry(26, 70, 20), rockMaterial);
    rock2.position.set(30, -25, -26);
    rock2.rotation.set(-0.15, -0.3, 0.2);
    pond.add(rock2);

    // Add collision circles for the two inner rocks
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

    // --- 5. GREEN REEDS/PLANTS IN WATER ---
    const reedGeo = new THREE.CylinderGeometry(0.4, 0.7, 68, 4);
    reedGeo.translate(0, 34, 0); // pivot at bottom

    const reedClusters = [
        [-54, -13], [-32, 38], [19, 45], [38, -13], [10, -54], [-10, -29]
    ];

    reedClusters.forEach(pos => {
        const count = 2 + Math.floor(Math.random() * 3);
        for (let j = 0; j < count; j++) {
            const reed = new THREE.Mesh(reedGeo, reedMaterial);
            const rx = pos[0] + (Math.random() - 0.5) * 8;
            const rz = pos[1] + (Math.random() - 0.5) * 8;
            
            // Reeds start on the floor (y=-60) and stick out of the water
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

    // Make the pond draggable and set its name for UI interactions
    pond.userData.draggable = true;
    pond.userData.collisionCircles = collisionCircles;

    return pond;
}
