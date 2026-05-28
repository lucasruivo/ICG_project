import * as THREE from 'three';

// Cria uma fogueira/lareira rústica com luz dinâmica
export function createCampfire() {
    const campfireGroup = new THREE.Group();
    campfireGroup.name = 'Campfire';
    campfireGroup.userData.draggable = true;

    const stoneMaterial = new THREE.MeshStandardMaterial({
        color: 0x6e6e6e,
        roughness: 0.88,
        metalness: 0.05,
        flatShading: true
    });

    const ashMaterial = new THREE.MeshStandardMaterial({
        color: 0x2e2e2e,
        roughness: 0.95,
        metalness: 0.0,
        flatShading: true
    });

    const woodMaterial = new THREE.MeshStandardMaterial({
        color: 0x5a2d0c,
        roughness: 0.9,
        metalness: 0.0,
        flatShading: true
    });

    // Base de cinzas no solo
    const ashGeo = new THREE.CylinderGeometry(15, 16.5, 2.5, 12);
    const ashMesh = new THREE.Mesh(ashGeo, ashMaterial);
    ashMesh.position.y = 1.25;
    ashMesh.receiveShadow = true;
    campfireGroup.add(ashMesh);

    // Anel de pedras circundante
    const numStones = 12;
    for (let i = 0; i < numStones; i++) {
        const angle = (i / numStones) * Math.PI * 2;
        const radius = 13.5 + (Math.random() - 0.5) * 1.2;
        const stoneSize = 2.4 + Math.random() * 1.3;

        const stoneGeo = new THREE.IcosahedronGeometry(stoneSize, 0);
        const stoneMesh = new THREE.Mesh(stoneGeo, stoneMaterial);
        
        stoneMesh.position.set(
            Math.cos(angle) * radius,
            stoneSize * 0.45,
            Math.sin(angle) * radius
        );
        stoneMesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        stoneMesh.scale.set(
            1 + (Math.random() - 0.5) * 0.25,
            1 + (Math.random() - 0.5) * 0.25,
            1 + (Math.random() - 0.5) * 0.25
        );
        stoneMesh.castShadow = true;
        stoneMesh.receiveShadow = true;
        campfireGroup.add(stoneMesh);
    }

    // Troncos de lenha empilhados
    const logGeo = new THREE.CylinderGeometry(1.2, 1.2, 13, 6);
    const numLogs = 6;
    for (let i = 0; i < numLogs; i++) {
        const angle = (i / numLogs) * Math.PI * 2;
        const logMesh = new THREE.Mesh(logGeo, woodMaterial);

        logMesh.position.set(
            Math.cos(angle) * 5,
            3.0,
            Math.sin(angle) * 5
        );
        logMesh.rotation.set(
            0.65,
            -angle + Math.PI / 2,
            0,
            'YXZ'
        );
        logMesh.castShadow = true;
        campfireGroup.add(logMesh);
    }

    // Chamas low-poly (cones concêntricos)
    const fireGroup = new THREE.Group();
    fireGroup.name = 'Flames';
    campfireGroup.add(fireGroup);

    const flameMaterialOuter = new THREE.MeshBasicMaterial({
        color: 0xff3c00,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        flatShading: true
    });

    const flameMaterialInner = new THREE.MeshBasicMaterial({
        color: 0xff9900,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        flatShading: true
    });

    const flameMaterialCore = new THREE.MeshBasicMaterial({
        color: 0xfff0a0,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        flatShading: true
    });

    const flameGeo1 = new THREE.ConeGeometry(7, 15, 5);
    const flameMesh1 = new THREE.Mesh(flameGeo1, flameMaterialOuter);
    flameMesh1.position.y = 8.5;
    fireGroup.add(flameMesh1);

    const flameGeo2 = new THREE.ConeGeometry(5.2, 11, 5);
    const flameMesh2 = new THREE.Mesh(flameGeo2, flameMaterialInner);
    flameMesh2.position.y = 7.5;
    fireGroup.add(flameMesh2);

    const flameGeo3 = new THREE.ConeGeometry(3.2, 7, 5);
    const flameMesh3 = new THREE.Mesh(flameGeo3, flameMaterialCore);
    flameMesh3.position.y = 6.2;
    fireGroup.add(flameMesh3);

    // Fonte de luz dinâmica (iluminação da fogueira à noite)
    const fireLight = new THREE.PointLight(0xff6e00, 48, 180, 1.2);
    fireLight.position.set(0, 9.5, 0);
    fireLight.castShadow = true;
    
    fireLight.shadow.mapSize.width = 512;
    fireLight.shadow.mapSize.height = 512;
    fireLight.shadow.bias = -0.015;
    campfireGroup.add(fireLight);

    // Guarda referências para animação
    campfireGroup.userData.fireLight = fireLight;
    campfireGroup.userData.fireGroup = fireGroup;
    campfireGroup.userData.baseIntensity = 48;

    const box = new THREE.Box3().setFromObject(campfireGroup);
    campfireGroup.position.y -= box.min.y;

    // Círculo de colisão com o humano
    campfireGroup.userData.collisionCircles = [
        { x: 0, z: 0, r: 16 }
    ];

    return campfireGroup;
}
