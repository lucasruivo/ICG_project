import * as THREE from 'three';

export function createDino2() {
    const dino2 = new THREE.Group();
    dino2.name = 'Ankylosaurus';
    dino2.userData.groundOffset = 20;

    // --- GRUPOS HIERÁRQUICOS ---
    const grupoCabeca = new THREE.Group();
    const grupoPernaFL = new THREE.Group(); // Front Left
    const grupoPernaFR = new THREE.Group(); // Front Right
    const grupoPernaBL = new THREE.Group(); // Back Left
    const grupoPernaBR = new THREE.Group(); // Back Right

    // Cauda hierárquica
    const grupoCauda1 = new THREE.Group();
    const grupoCauda2 = new THREE.Group();
    const grupoCauda3 = new THREE.Group();
    const grupoCauda4 = new THREE.Group();

    dino2.add(grupoCabeca, grupoPernaFL, grupoPernaFR, grupoPernaBL, grupoPernaBR, grupoCauda1);
    grupoCauda1.add(grupoCauda2);
    grupoCauda2.add(grupoCauda3);
    grupoCauda3.add(grupoCauda4);

    // --- TEXTURAS ---
    const loader = new THREE.TextureLoader();
    const escamas = loader.load('https://thumbs.dreamstime.com/b/pele-do-lagarto-21407373.jpg');
    const osso = loader.load('https://media.istockphoto.com/id/149170269/pt/foto/alta-resolução-média-desenho-de-dente-monocromático-textura-do-papel.jpg?s=170667a&w=0&k=20&c=MyUep2AtW6XDijffMgYBcwfI9lEZs_N1Xiz_pYcmgAo=');

    // --- MATERIAIS ---
    const bodyMaterial = new THREE.MeshStandardMaterial({
        map: escamas,
        color: 0x8b7355, // Tom acastanhado/couro
        roughness: 0.9,
        flatShading: true
    });

    const armorMaterial = new THREE.MeshStandardMaterial({
        map: escamas,
        color: 0x4a3b32, // Carapaça castanho-escura
        roughness: 0.85,
        flatShading: true
    });

    const spikeMaterial = new THREE.MeshStandardMaterial({
        color: 0xe65c00, // Laranja vibrante nas pontas
        roughness: 0.6,
        flatShading: true
    });

    const boneMaterial = new THREE.MeshStandardMaterial({
        map: osso,
        color: 0xcccccc, // Tom osso para a clava e unhas
        roughness: 0.9
    });

    const eyeMaterial = new THREE.MeshStandardMaterial({
        color: 0xffcc00, // Olhos amarelos
        roughness: 0.2
    });

    const irisMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 0.1,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -2
    });

    // --- CORPO (Torso Achatado e Largo) ---
    const torsoGeo = new THREE.BoxGeometry(110, 36, 75);
    const torso = new THREE.Mesh(torsoGeo, bodyMaterial);
    torso.position.y = 25;
    dino2.add(torso);

    // Carapaça Superior (Armadura)
    const carapaceGeo = new THREE.BoxGeometry(100, 10, 80);
    const carapace = new THREE.Mesh(carapaceGeo, armorMaterial);
    carapace.position.set(0, 23, 0); // Posicionada no topo do torso
    torso.add(carapace);

    // --- PICOS DA CARAPAÇA (Osteodermes) ---
    const spikeGeo = new THREE.ConeGeometry(4.5, 14, 4);

    // Adicionar 4 filas de picos no dorso
    const rowsX = [-40, -20, 0, 20, 40];
    const rowsZ = [-28, -7, 7, 28];

    rowsX.forEach((x, rIdx) => {
        rowsZ.forEach((z, cIdx) => {
            const spike = new THREE.Mesh(spikeGeo, spikeMaterial);
            spike.position.set(x, 10, z);
            // Inclinar ligeiramente os picos laterais para fora
            if (cIdx === 0) spike.rotation.x = -Math.PI / 8;
            if (cIdx === 3) spike.rotation.x = Math.PI / 8;
            carapace.add(spike);
        });
    });

    // Grandes Espinhos Laterais de Proteção
    const lateralSpikeGeo = new THREE.ConeGeometry(6, 22, 4);
    lateralSpikeGeo.rotateX(Math.PI / 2);

    const latX = [-30, -10, 10, 30];
    latX.forEach(x => {
        // Lado Esquerdo
        const lSpike = new THREE.Mesh(lateralSpikeGeo, spikeMaterial);
        lSpike.position.set(x, 0, 40);
        lSpike.rotation.y = Math.PI / 10;
        lSpike.rotation.x = Math.PI * 2 - 0.1;
        carapace.add(lSpike);

        // Lado Direito
        const rSpike = new THREE.Mesh(lateralSpikeGeo, spikeMaterial);
        rSpike.position.set(x, 0, -40);
        rSpike.rotation.y = Math.PI - Math.PI / 10;
        rSpike.rotation.x = Math.PI * 2 + 0.1;
        carapace.add(rSpike);
    });


    // --- CABEÇA E PESCOÇO ---
    // Pescoço curto e largo
    const neckGeo = new THREE.BoxGeometry(22, 22, 32);
    const neck = new THREE.Mesh(neckGeo, bodyMaterial);
    neck.position.set(-62, 22, 0);
    dino2.add(neck);

    // Crânio do Anquilossauro (Largo e Achatado)
    const skullGeo = new THREE.BoxGeometry(32, 20, 32);
    const skull = new THREE.Mesh(skullGeo, bodyMaterial);
    skull.position.set(-82, 22, 0);
    grupoCabeca.add(skull);

    // Armadura do topo da cabeça
    const headArmorGeo = new THREE.BoxGeometry(26, 6, 28);
    const headArmor = new THREE.Mesh(headArmorGeo, armorMaterial);
    headArmor.position.set(0, 11, 0);
    skull.add(headArmor);

    // Chifres Traseiros (Proteção da Nuca)
    const hornGeo = new THREE.ConeGeometry(4, 12, 4);
    hornGeo.rotateX(Math.PI / 2);

    const hornL = new THREE.Mesh(hornGeo, spikeMaterial);
    hornL.position.set(12, 6, 14);
    hornL.rotation.y = Math.PI / 3;
    hornL.rotation.x = Math.PI / 12;
    skull.add(hornL);

    const hornR = new THREE.Mesh(hornGeo, spikeMaterial);
    hornR.position.set(12, 6, -14);
    hornR.rotation.y = -Math.PI / 3;
    hornR.rotation.x = -Math.PI / 12;
    skull.add(hornR);

    // Chifres das Bochechas
    const cheekL = new THREE.Mesh(hornGeo, spikeMaterial);
    cheekL.position.set(-4, -6, 15);
    cheekL.rotation.y = Math.PI / 2;
    cheekL.rotation.x = Math.PI / 6;
    skull.add(cheekL);

    const cheekR = new THREE.Mesh(hornGeo, spikeMaterial);
    cheekR.position.set(-4, -6, -15);
    cheekR.rotation.y = -Math.PI / 2;
    cheekR.rotation.x = -Math.PI / 6;
    skull.add(cheekR);

    // Olhos
    const eyeGeo = new THREE.SphereGeometry(3.5, 16, 16);
    const eyeL = new THREE.Mesh(eyeGeo, eyeMaterial);
    eyeL.position.set(-10, 4, 15.2);
    skull.add(eyeL);

    const irisL = new THREE.Mesh(new THREE.SphereGeometry(1.8, 16, 16), irisMaterial);
    irisL.position.set(-11, 4, 17.2);
    skull.add(irisL);

    const eyeR = new THREE.Mesh(eyeGeo, eyeMaterial);
    eyeR.position.set(-10, 4, -15.2);
    skull.add(eyeR);

    const irisR = new THREE.Mesh(new THREE.SphereGeometry(1.8, 16, 16), irisMaterial);
    irisR.position.set(-11, 4, -17.2);
    skull.add(irisR);


    // --- CAUDA HIERÁRQUICA E CLAVA ---
    const tailSegGeo = new THREE.BoxGeometry(20, 16, 16);

    // Segmento 1
    const tail1 = new THREE.Mesh(tailSegGeo, bodyMaterial);
    tail1.position.set(10, 0, 0);
    grupoCauda1.add(tail1);
    grupoCauda1.position.set(55, 22, 0); // Junta-se à traseira do torso

    // Segmento 2
    const tail2 = new THREE.Mesh(tailSegGeo, bodyMaterial);
    tail2.position.set(18, 0, 0);
    tail2.scale.set(0.85, 0.85, 0.85);
    grupoCauda2.add(tail2);
    grupoCauda2.position.set(18, 0, 0);

    // Segmento 3
    const tail3 = new THREE.Mesh(tailSegGeo, bodyMaterial);
    tail3.position.set(16, 0, 0);
    tail3.scale.set(0.7, 0.7, 0.7);
    grupoCauda3.add(tail3);
    grupoCauda3.position.set(16, 0, 0);

    // Segmento 4 (Base da Clava)
    const tail4 = new THREE.Mesh(tailSegGeo, bodyMaterial);
    tail4.position.set(14, 0, 0);
    tail4.scale.set(0.55, 0.55, 0.55);
    grupoCauda4.add(tail4);
    grupoCauda4.position.set(14, 0, 0);

    // Clava da cauda (Bony Club) - Composta por dois grandes lobos esféricos achatados
    const clubLoboGeo = new THREE.SphereGeometry(13, 20, 20);
    clubLoboGeo.scale(1.3, 0.7, 0.9); // Alongada e achatada

    const clubL = new THREE.Mesh(clubLoboGeo, boneMaterial);
    clubL.position.set(24, 0, 6);
    grupoCauda4.add(clubL);

    const clubR = new THREE.Mesh(clubLoboGeo, boneMaterial);
    clubR.position.set(24, 0, -6);
    grupoCauda4.add(clubR);

    // Picos protetores da cauda (Pequenos cones ao longo dos segmentos)
    const smallSpikeGeo = new THREE.ConeGeometry(2, 6, 4);
    smallSpikeGeo.rotateX(Math.PI / 2);

    [tail1, tail2, tail3].forEach(seg => {
        const sp1 = new THREE.Mesh(smallSpikeGeo, spikeMaterial);
        sp1.position.set(0, 9, 0);
        seg.add(sp1);
    });


    // --- PERNAS (4 Pernas Curtas e Robustas para Suportar o Peso) ---
    const thighGeo = new THREE.BoxGeometry(20, 24, 20);
    const shinGeo = new THREE.BoxGeometry(14, 18, 14);
    const footGeo = new THREE.BoxGeometry(22, 6, 24);

    // Função auxiliar para montar uma perna
    function buildLeg(group, x, z) {
        group.position.set(x, 18, z);

        // Coxa (Thigh)
        const thigh = new THREE.Mesh(thighGeo, bodyMaterial);
        thigh.position.y = -6;
        group.add(thigh);

        // Canela (Shin)
        const shin = new THREE.Mesh(shinGeo, bodyMaterial);
        shin.position.y = -22;
        group.add(shin);

        // Pé (Foot)
        const foot = new THREE.Mesh(footGeo, boneMaterial);
        foot.position.set(-2, -30, 0);
        group.add(foot);

        // Garras/Unhas (3 cones à frente)
        const clawGeo = new THREE.ConeGeometry(2.5, 6, 4);
        clawGeo.rotateX(Math.PI / 2);

        const zOffsets = [-7, 0, 7];
        zOffsets.forEach(zo => {
            const claw = new THREE.Mesh(clawGeo, boneMaterial);
            claw.position.set(-11, -3, zo);
            claw.rotation.y = -Math.PI / 2;
            foot.add(claw);
        });
    }

    buildLeg(grupoPernaFL, -35, 32);
    buildLeg(grupoPernaFR, -35, -32);
    buildLeg(grupoPernaBL, 30, 32);
    buildLeg(grupoPernaBR, 30, -32);

    // --- POSICIONAMENTO E ESCALA ---
    // Centraliza o modelo no chão de forma que a base fique em y = 0
    const bbox = new THREE.Box3().setFromObject(dino2);
    dino2.position.y -= bbox.min.y;

    dino2.userData.draggable = true;
    dino2.userData.collisionCircles = [
        { x: 0, z: 0, r: 58 }
    ];

    return {
        model: dino2,
        parts: {
            grupoCabeca,
            grupoPernaFL,
            grupoPernaFR,
            grupoPernaBL,
            grupoPernaBR,
            grupoCauda1,
            grupoCauda2,
            grupoCauda3,
            grupoCauda4,
            torso,
            carapace,
            skull,
            clubL,
            clubR
        }
    };
}
