import * as THREE from 'three';

export function createTree() {
    const treeGroup = new THREE.Group();

    const loader = new THREE.TextureLoader();
    const barkTexture = loader.load('https://media.istockphoto.com/id/651779992/pt/vetorial/seamless-tree-bark-texture-endless-wooden-background-for-web-page-fill-or-graphic-design.jpg?s=612x612&w=0&k=20&c=3FjcTIHBij3wEHXTwYeYEq13CDVOn7FFnMVV-V51SU0=');

    const rand = (min, max) => THREE.MathUtils.randFloat(min, max);

    const variation = {
        trunkWidth: rand(0.9, 1.16),
        trunkHeight: rand(0.9, 1.15),
        branchLen: rand(0.9, 1.14),
        branchWidth: rand(0.9, 1.12),
        branchYawOffset: rand(-0.18, 0.18),
        branchTiltOffset: rand(-0.10, 0.10),
        canopyScale: rand(0.9, 1.16),
        overallScale: rand(0.9, 1.2),
    };

    // == HELPERS DE FORMA ==

    // Forma em lozange/folha para ramos: base estreita, alarga no meio, afunila na ponta
    function makeBranchShape(length, width) {
        const s = new THREE.Shape();
        s.moveTo(0, 0);
        s.quadraticCurveTo( width, length * 0.25,  width, length * 0.5);
        s.quadraticCurveTo( width, length * 0.75,  0,     length);
        s.quadraticCurveTo(-width, length * 0.75, -width, length * 0.5);
        s.quadraticCurveTo(-width, length * 0.25,  0,     0);
        return s;
    }

    // Forma de estrela para a copa
    function makeStarShape(outerR, innerR, points) {
        const s = new THREE.Shape();
        for (let i = 0; i < points * 2; i++) {
            const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
            const r = (i % 2 === 0) ? outerR : innerR;
            if (i === 0) s.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
            else         s.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        s.closePath();
        return s;
    }
    // == MATERIAIS ==
    const brownMaterial = new THREE.MeshStandardMaterial({ map: barkTexture });
    const baseGreen = new THREE.Color(0x228B22);
    const greenHsl = { h: 0, s: 0, l: 0 };
    baseGreen.getHSL(greenHsl);
    const variedGreen = new THREE.Color().setHSL(
        (greenHsl.h + rand(-0.03, 0.03) + 1) % 1,
        THREE.MathUtils.clamp(greenHsl.s + rand(-0.08, 0.05), 0, 1),
        THREE.MathUtils.clamp(greenHsl.l + rand(-0.07, 0.08), 0, 1)
    );
    const greenMaterial  = new THREE.MeshLambertMaterial({ color: variedGreen, side: THREE.DoubleSide });

    // == TRONCO (caixa quadrada) ==
    const trunkW = 30 * variation.trunkWidth;
    const trunkH = 100 * variation.trunkHeight;
    const trunk = new THREE.Mesh(new THREE.BoxGeometry(trunkW, trunkH, trunkW), brownMaterial);
    trunk.position.y = trunkH / 2;
    treeGroup.add(trunk);

        const rootGeometry = new THREE.BoxGeometry(20,12,20);
    const root = new THREE.Mesh(rootGeometry, brownMaterial);
    root.position.x = 10
    root.position.y = 7
    root.position.z = 10
    treeGroup.add(root);

    const root2 = new THREE.Mesh(rootGeometry, brownMaterial);
    root2.position.x = 13
    root2.position.y = 4
    root2.position.z = 23
    treeGroup.add(root2);

    const root3 = new THREE.Mesh(rootGeometry, brownMaterial);
    root3.position.x = 17
    root3.position.y = 2
    root3.position.z = 29
    treeGroup.add(root3);

    const rootGeometry2 = new THREE.BoxGeometry(15,5,15);
    const root4 = new THREE.Mesh(rootGeometry2, brownMaterial);
    root4.position.x = 25
    root4.position.y = 2
    root4.position.z = 34
    treeGroup.add(root4);

    const root5 = new THREE.Mesh(rootGeometry, brownMaterial);
    root5.position.x = -10
    root5.position.y = 7
    root5.position.z = -10
    treeGroup.add(root5);

    const root6 = new THREE.Mesh(rootGeometry, brownMaterial);
    root6.position.x = -13
    root6.position.y = 4
    root6.position.z = -23
    treeGroup.add(root6);
    
    const root7 = new THREE.Mesh(rootGeometry, brownMaterial);
    root7.position.x = -17
    root7.position.y = 2
    root7.position.z = -29
    treeGroup.add(root7);
    
    const root8 = new THREE.Mesh(rootGeometry2, brownMaterial);
    root8.position.x = -25
    root8.position.y = 2
    root8.position.z = -34
    treeGroup.add(root8);

    const root9 = new THREE.Mesh(rootGeometry, brownMaterial);
    root9.position.x = 10
    root9.position.y = 7
    root9.position.z = -10
    treeGroup.add(root9);
    
    const root10 = new THREE.Mesh(rootGeometry, brownMaterial);
    root10.position.x = 13
    root10.position.y = 4
    root10.position.z = -23
    treeGroup.add(root10);
    
    const root11 = new THREE.Mesh(rootGeometry, brownMaterial);
    root11.position.x = 17
    root11.position.y = 2
    root11.position.z = -29
    treeGroup.add(root11);
    
    const root12 = new THREE.Mesh(rootGeometry2, brownMaterial);
    root12.position.x = 25
    root12.position.y = 2
    root12.position.z = -34
    treeGroup.add(root12);

    const root13 = new THREE.Mesh(rootGeometry, brownMaterial);
    root13.position.x = -10
    root13.position.y = 7
    root13.position.z = 10
    treeGroup.add(root13);
    
    const root14 = new THREE.Mesh(rootGeometry, brownMaterial);
    root14.position.x = -13
    root14.position.y = 4
    root14.position.z = 23
    treeGroup.add(root14);
    
    const root15 = new THREE.Mesh(rootGeometry, brownMaterial);
    root15.position.x = -17
    root15.position.y = 2
    root15.position.z = 29
    treeGroup.add(root15);
    
    const root16 = new THREE.Mesh(rootGeometry2, brownMaterial);
    root16.position.x = -25
    root16.position.y = 2
    root16.position.z = 34
    treeGroup.add(root16);

    // == RAMOS com ExtrudeGeometry ==
    const branchExtrudeOpts = {
        depth: 7,
        bevelEnabled: true,
        bevelThickness: 2,
        bevelSize: 2,
        bevelSegments: 5,
        curveSegments: 16
    };

    // [altura no tronco, rotação Y (direção), inclinação X (ângulo de saída), comprimento, largura]
    const branchDefs = [
        { y: 48,  rotY: 0,              rotX: -Math.PI / 3.5, len: 65, w: 9 },
        { y: 56,  rotY: Math.PI / 2,    rotX: -Math.PI / 3.5, len: 60, w: 9 },
        { y: 64,  rotY: Math.PI,        rotX: -Math.PI / 3.5, len: 62, w: 9 },
        { y: 70,  rotY: -Math.PI / 2,   rotX: -Math.PI / 3.5, len: 55, w: 9 },
        { y: 80,  rotY: Math.PI / 4,    rotX: -Math.PI / 3,   len: 48, w: 7 },
        { y: 87,  rotY: -Math.PI * 3/4, rotX: -Math.PI / 3,   len: 44, w: 7 },
        { y: 92,  rotY: Math.PI * 3/4,  rotX: -Math.PI / 2.8, len: 38, w: 6 },
    ];

    branchDefs.forEach(b => {
        const len = b.len * variation.branchLen * rand(0.94, 1.08);
        const width = b.w * variation.branchWidth * rand(0.94, 1.06);
        const rotY = b.rotY + variation.branchYawOffset + rand(-0.08, 0.08);
        const rotX = b.rotX + variation.branchTiltOffset + rand(-0.05, 0.05);
        const y = b.y * variation.trunkHeight;

        const geo = new THREE.ExtrudeGeometry(makeBranchShape(len, width), branchExtrudeOpts);
        // Centrar a profundidade no eixo Z para o bevel ficar centrado
        geo.translate(0, 0, -branchExtrudeOpts.depth / 2);
        const mesh = new THREE.Mesh(geo, brownMaterial);
        mesh.rotation.order = 'YXZ';
        mesh.rotation.y = rotY;
        mesh.rotation.x = rotX;
        mesh.position.y = y;
        treeGroup.add(mesh);

        // Mini folhagem no topo de cada ramo (estrela pequena extrudida)
        const miniOuter = 22 * rand(0.9, 1.12);
        const miniInner = 12 * rand(0.9, 1.12);
        const miniCanopyGeo = new THREE.ExtrudeGeometry(makeStarShape(miniOuter, miniInner, 8), {
            depth: 8, bevelEnabled: true, bevelThickness: 3, bevelSize: 2, bevelSegments: 8, curveSegments: 32
        });
        const miniCanopy = new THREE.Mesh(miniCanopyGeo, greenMaterial);
        // Posicionar no extremo do ramo (b.len ao longo do eixo do ramo)
        const dist = len * 0.9;
        miniCanopy.rotation.order = 'YXZ';
        miniCanopy.rotation.y = rotY;
        miniCanopy.rotation.x = rotX - Math.PI / 2; // deitar horizontal
        miniCanopy.position.set(
            Math.sin(rotY) * Math.cos(rotX) * dist * -1,
            y + Math.abs(Math.sin(rotX)) * dist,
            Math.cos(rotY) * Math.cos(rotX) * dist * -1
        );
        treeGroup.add(miniCanopy);
    });

    // == COPA PRINCIPAL: estrela extrudida em 3 camadas horizontais ==
    const canopyExtrudeOpts = {
        depth: 20,
        bevelEnabled: true,
        bevelThickness: 7,
        bevelSize: 5,
        bevelSegments: 8,
        curveSegments: 32
    };

    const canopyOuter = 68 * variation.canopyScale * rand(0.94, 1.08);
    const canopyInner = 36 * variation.canopyScale * rand(0.94, 1.08);

    [
        { y: 128, scale: 1.0,  rotZ: 0              },
        { y: 154, scale: 0.75, rotZ: Math.PI / 6    },
        { y: 169, scale: 0.52, rotZ: Math.PI / 3    },
    ].forEach(layer => {
        const geo = new THREE.ExtrudeGeometry(makeStarShape(canopyOuter, canopyInner, 12), canopyExtrudeOpts);
        const mesh = new THREE.Mesh(geo, greenMaterial);
        mesh.rotation.x = Math.PI / 2;  // deitado (horizontal)
        mesh.rotation.z = layer.rotZ + rand(-0.12, 0.12);
        mesh.scale.setScalar(layer.scale * rand(0.95, 1.06));
        mesh.position.y = layer.y * variation.trunkHeight;
        treeGroup.add(mesh);
    });

    treeGroup.scale.setScalar(variation.overallScale);
    treeGroup.rotation.y = rand(0, Math.PI * 2);

    treeGroup.userData.draggable = true;
    treeGroup.name = "Tree";

    return treeGroup;
}

