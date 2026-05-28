import * as THREE from 'three';

/**
 * Cria uma fogueira/lareira rústica de acampamento.
 * @returns {THREE.Group}
 */
export function createCampfire() {
    const campfireGroup = new THREE.Group();
    campfireGroup.name = 'Campfire';
    campfireGroup.userData.draggable = true;

    // Materiais
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

    // 1. Cama de cinzas/carvão (cilindro escuro na base)
    const ashGeo = new THREE.CylinderGeometry(15, 16.5, 2.5, 12);
    const ashMesh = new THREE.Mesh(ashGeo, ashMaterial);
    ashMesh.position.y = 1.25;
    ashMesh.receiveShadow = true;
    campfireGroup.add(ashMesh);

    // 2. Anel de pedras circundantes (dispostas num círculo de raio ~14)
    const numStones = 12;
    for (let i = 0; i < numStones; i++) {
        const angle = (i / numStones) * Math.PI * 2;
        const radius = 13.5 + (Math.random() - 0.5) * 1.2;
        const stoneSize = 2.4 + Math.random() * 1.3;

        // Geometria low-poly (Icosaedro)
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

    // 3. Troncos de lenha (dispostos em pirâmide/fogueira índia cruzados ao centro)
    const logGeo = new THREE.CylinderGeometry(1.2, 1.2, 13, 6);
    const numLogs = 6;
    for (let i = 0; i < numLogs; i++) {
        const angle = (i / numLogs) * Math.PI * 2;
        const logMesh = new THREE.Mesh(logGeo, woodMaterial);

        // Posicionar os troncos inclinados para dentro em direção ao centro
        logMesh.position.set(
            Math.cos(angle) * 5,
            3.0,
            Math.sin(angle) * 5
        );
        logMesh.rotation.set(
            0.65, // inclinação para dentro
            -angle + Math.PI / 2, // apontar ao centro
            0,
            'YXZ'
        );
        logMesh.castShadow = true;
        campfireGroup.add(logMesh);
    }

    // 4. Chamas Low-poly (3 cones concêntricos com diferentes gradientes e misturas)
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

    // Chama exterior (maior)
    const flameGeo1 = new THREE.ConeGeometry(7, 15, 5);
    const flameMesh1 = new THREE.Mesh(flameGeo1, flameMaterialOuter);
    flameMesh1.position.y = 8.5;
    fireGroup.add(flameMesh1);

    // Chama média
    const flameGeo2 = new THREE.ConeGeometry(5.2, 11, 5);
    const flameMesh2 = new THREE.Mesh(flameGeo2, flameMaterialInner);
    flameMesh2.position.y = 7.5;
    fireGroup.add(flameMesh2);

    // Chama interior/núcleo (pequena e brilhante)
    const flameGeo3 = new THREE.ConeGeometry(3.2, 7, 5);
    const flameMesh3 = new THREE.Mesh(flameGeo3, flameMaterialCore);
    flameMesh3.position.y = 6.2;
    fireGroup.add(flameMesh3);

    // 5. Fonte de Luz Dinâmica (PointLight) para iluminar à noite
    const fireLight = new THREE.PointLight(0xff6e00, 48, 180, 1.2);
    fireLight.position.set(0, 9.5, 0);
    fireLight.castShadow = true;
    
    // Otimização de sombras da luz da fogueira
    fireLight.shadow.mapSize.width = 512;
    fireLight.shadow.mapSize.height = 512;
    fireLight.shadow.bias = -0.015;
    campfireGroup.add(fireLight);

    // Guardar referências nos metadados para controlo posterior da animação
    campfireGroup.userData.fireLight = fireLight;
    campfireGroup.userData.fireGroup = fireGroup;
    campfireGroup.userData.baseIntensity = 48;

    // Assentar corretamente todo o conjunto em y=0
    const box = new THREE.Box3().setFromObject(campfireGroup);
    campfireGroup.position.y -= box.min.y;

    // Círculo de colisão com raio de 16 unidades para colidir com o humano
    campfireGroup.userData.collisionCircles = [
        { x: 0, z: 0, r: 16 }
    ];

    return campfireGroup;
}
