import * as THREE from 'three';

export function createDino2() {
    const dino2 = new THREE.Group();
    dino2.name = 'Ankylosaurus';
    dino2.userData.groundOffset = 20;

    // Grupos hierárquicos para animação
    const grupoCabeca = new THREE.Group();
    const grupoPernaFL = new THREE.Group();
    const grupoPernaFR = new THREE.Group();
    const grupoPernaBL = new THREE.Group();
    const grupoPernaBR = new THREE.Group();

    const grupoCoxaFL = new THREE.Group();
    const grupoCoxaFR = new THREE.Group();
    const grupoCoxaBL = new THREE.Group();
    const grupoCoxaBR = new THREE.Group();

    const grupoCauda1 = new THREE.Group();
    const grupoCauda2 = new THREE.Group();
    const grupoCauda3 = new THREE.Group();
    const grupoCauda4 = new THREE.Group();

    dino2.add(grupoCabeca, grupoPernaFL, grupoPernaFR, grupoPernaBL, grupoPernaBR, grupoCauda1);
    dino2.add(grupoCoxaFL, grupoCoxaFR, grupoCoxaBL, grupoCoxaBR);
    grupoCauda1.add(grupoCauda2);
    grupoCauda2.add(grupoCauda3);
    grupoCauda3.add(grupoCauda4);

    // Carregamento de texturas
    const loader = new THREE.TextureLoader();
    const escamas = loader.load('https://thumbs.dreamstime.com/b/pele-do-lagarto-21407373.jpg');
    const osso = loader.load('https://media.istockphoto.com/id/149170269/pt/foto/alta-resolução-média-desenho-de-dente-monocromático-textura-do-papel.jpg?s=170667a&w=0&k=20&c=MyUep2AtW6XDijffMgYBcwfI9lEZs_N1Xiz_pYcmgAo=');

    // Materiais
    const bodyMaterial = new THREE.MeshStandardMaterial({
        map: escamas,
        color: 0x8b7355,
        roughness: 0.9,
        flatShading: true
    });

    const armorMaterial = new THREE.MeshStandardMaterial({
        map: escamas,
        color: 0x4a3b32,
        roughness: 0.85,
        flatShading: true
    });

    const spikeMaterial = new THREE.MeshStandardMaterial({
        color: 0xe65c00,
        roughness: 0.6,
        flatShading: true
    });

    const boneMaterial = new THREE.MeshStandardMaterial({
        map: osso,
        color: 0xcccccc,
        roughness: 0.9
    });

    const eyeMaterial = new THREE.MeshStandardMaterial({
        color: 0xffcc00,
        roughness: 0.2
    });

    const irisMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 0.1,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -2
    });

    // Corpo e carapaça
    const torsoGeo = new THREE.BoxGeometry(110, 36, 75);
    const torso = new THREE.Mesh(torsoGeo, bodyMaterial);
    torso.position.y = 25;
    dino2.add(torso);

    const carapaceGeo = new THREE.BoxGeometry(100, 10, 80);
    const carapace = new THREE.Mesh(carapaceGeo, armorMaterial);
    carapace.position.set(0, 23, 0);
    torso.add(carapace);

    // Picos da carapaça (Osteodermes)
    const spikeGeo = new THREE.ConeGeometry(4.5, 14, 4);

    const rowsX = [-40, -20, 0, 20, 40];
    const rowsZ = [-28, -7, 7, 28];

    rowsX.forEach((x, rIdx) => {
        rowsZ.forEach((z, cIdx) => {
            const spike = new THREE.Mesh(spikeGeo, spikeMaterial);
            spike.position.set(x, 10, z);
            if (cIdx === 0) spike.rotation.x = -Math.PI / 8;
            if (cIdx === 3) spike.rotation.x = Math.PI / 8;
            carapace.add(spike);
        });
    });

    // Espinhos laterais de proteção
    const lateralSpikeGeo = new THREE.ConeGeometry(6, 22, 4);
    lateralSpikeGeo.rotateX(Math.PI / 2);

    const latX = [-30, -10, 10, 30];
    latX.forEach(x => {
        const lSpike = new THREE.Mesh(lateralSpikeGeo, spikeMaterial);
        lSpike.position.set(x, 0, 40);
        lSpike.rotation.y = Math.PI / 10;
        lSpike.rotation.x = Math.PI * 2 - 0.1;
        carapace.add(lSpike);

        const rSpike = new THREE.Mesh(lateralSpikeGeo, spikeMaterial);
        rSpike.position.set(x, 0, -40);
        rSpike.rotation.y = Math.PI - Math.PI / 10;
        rSpike.rotation.x = Math.PI * 2 + 0.1;
        carapace.add(rSpike);
    });

    // Cabeça e pescoço
    const neckGeo = new THREE.BoxGeometry(22, 22, 32);
    const neck = new THREE.Mesh(neckGeo, bodyMaterial);
    neck.position.set(-62, 22, 0);
    grupoCabeca.add(neck);

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

    // Chifres e proteção da nuca
    const hornGeo = new THREE.ConeGeometry(4, 12, 4);
    hornGeo.rotateX(Math.PI / 2);

    const hornL = new THREE.Mesh(hornGeo, spikeMaterial);
    hornL.position.set(12, 11, 17);
    hornL.rotation.y = Math.PI / 2 + Math.PI / 3;
    hornL.rotation.x = Math.PI / 2 + Math.PI / 3;
    skull.add(hornL);

    const hornR = new THREE.Mesh(hornGeo, spikeMaterial);
    hornR.position.set(12, 11, -17);
    hornR.rotation.y =  -Math.PI / 2 - Math.PI / 3 + Math.PI;
    hornR.rotation.x =  -Math.PI / 2 - Math.PI / 3;
    skull.add(hornR);

    // Chifres das bochechas
    const cheekL = new THREE.Mesh(hornGeo, spikeMaterial);
    cheekL.position.set(10, -10, 17);
    cheekL.rotation.y = Math.PI /6;
    cheekL.rotation.x = Math.PI / 6;
    skull.add(cheekL);

    const cheekR = new THREE.Mesh(hornGeo, spikeMaterial);
    cheekR.position.set(10, -10, -17);
    cheekR.rotation.y = Math.PI -Math.PI / 6;
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

    // Cauda hierárquica e clava (Bony Club)
    const tailSegGeo = new THREE.BoxGeometry(20, 16, 16);

    const tail1 = new THREE.Mesh(tailSegGeo, bodyMaterial);
    tail1.position.set(8, 0, 0);
    grupoCauda1.add(tail1);
    grupoCauda1.position.set(55, 22, 0);

    const tail2 = new THREE.Mesh(tailSegGeo, bodyMaterial);
    tail2.position.set(7, 0, 0);
    tail2.scale.set(0.85, 0.85, 0.85);
    grupoCauda2.add(tail2);
    grupoCauda2.position.set(18, 0, 0);

    const tail3 = new THREE.Mesh(tailSegGeo, bodyMaterial);
    tail3.position.set(4, 0, 0);
    tail3.scale.set(0.7, 0.7, 0.7);
    grupoCauda3.add(tail3);
    grupoCauda3.position.set(16, 0, 0);

    const tail4 = new THREE.Mesh(tailSegGeo, bodyMaterial);
    tail4.position.set(1, 0, 0);
    tail4.scale.set(0.55, 0.55, 0.55);
    grupoCauda4.add(tail4);
    grupoCauda4.position.set(14, 0, 0);

    const clubLoboGeo = new THREE.SphereGeometry(13, 20, 20);
    clubLoboGeo.scale(1.3, 0.7, 0.9);

    const clubL = new THREE.Mesh(clubLoboGeo, boneMaterial);
    clubL.position.set(12, 0, 6);
    grupoCauda4.add(clubL);

    const clubR = new THREE.Mesh(clubLoboGeo, boneMaterial);
    clubR.position.set(12, 0, -6);
    grupoCauda4.add(clubR);

    // Cones/picos de proteção na cauda
    const smallSpikeGeo = new THREE.ConeGeometry(2, 6, 4);

    [tail1, tail2, tail3].forEach(seg => {
        const sp1 = new THREE.Mesh(smallSpikeGeo, spikeMaterial);
        sp1.position.set(0, 9, 0);
        seg.add(sp1);
    });

    // Pernas (4 robustas para suportar o peso)
    const thighGeo = new THREE.BoxGeometry(20, 24, 20);
    const shinGeo = new THREE.BoxGeometry(14, 18, 14);
    const footGeo = new THREE.BoxGeometry(22, 6, 24);

    // Função auxiliar para construir cada perna
    function buildLeg(groupThigh, groupShin, x, z) {
        groupThigh.position.set(x, 18, z);
        groupShin.position.set(x, 18, z);

        const thigh = new THREE.Mesh(thighGeo, bodyMaterial);
        thigh.position.y = -6;
        groupThigh.add(thigh);

        const shin = new THREE.Mesh(shinGeo, bodyMaterial);
        shin.position.y = -22;
        groupShin.add(shin);

        const foot = new THREE.Mesh(footGeo, boneMaterial);
        foot.position.set(-2, -30, 0);
        groupShin.add(foot);

        const clawGeo = new THREE.ConeGeometry(2.5, 6, 4);
        clawGeo.rotateX(Math.PI / 2);

        const zOffsets = [-7, 0, 7];
        zOffsets.forEach(zo => {
            const claw = new THREE.Mesh(clawGeo, boneMaterial);
            claw.position.set(-11, 0.5, zo);
            claw.rotation.y = -Math.PI / 2;
            foot.add(claw);
        });
    }

    buildLeg(grupoCoxaFL, grupoPernaFL, -35, 32);
    buildLeg(grupoCoxaFR, grupoPernaFR, -35, -32);
    buildLeg(grupoCoxaBL, grupoPernaBL, 30, 32);
    buildLeg(grupoCoxaBR, grupoPernaBR, 30, -32);

    // Ajuste da altura do modelo ao solo
    const bbox = new THREE.Box3().setFromObject(dino2);
    dino2.position.y -= bbox.min.y;

    dino2.userData.draggable = true;
    dino2.userData.collisionCircles = [
        { x: -25, z: 0, r: 35 }, // Cabeça e ombros
        { x: 5, z: 0, r: 42 },   // Torso
        { x: 35, z: 0, r: 25 }   // Cauda
    ];

    return {
        model: dino2,
        parts: {
            grupoCabeca,
            grupoPernaFL,
            grupoPernaFR,
            grupoPernaBL,
            grupoPernaBR,
            grupoCoxaFL,
            grupoCoxaFR,
            grupoCoxaBL,
            grupoCoxaBR,
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
