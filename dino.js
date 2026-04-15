import * as THREE from 'three';

export function createDino() {
    const dino = new THREE.Group();
    dino.name = 'Dino';
    dino.userData.groundOffset = 25;
    const grupoCabecaSuperior = new THREE.Group();
    const grupoMandibula = new THREE.Group();
    const grupopernaa = new THREE.Group();
    const grupopernab = new THREE.Group();

    dino.add(grupoCabecaSuperior, grupoMandibula, grupopernaa, grupopernab);

    //loader 
    const loader = new THREE.TextureLoader();
    const escamas = loader.load('https://thumbs.dreamstime.com/b/pele-do-lagarto-21407373.jpg');
    const osso = loader.load('https://media.istockphoto.com/id/149170269/pt/foto/alta-resolução-média-desenho-de-dente-monocromático-textura-do-papel.jpg?s=170667a&w=0&k=20&c=MyUep2AtW6XDijffMgYBcwfI9lEZs_N1Xiz_pYcmgAo=')
    const pelo = loader.load('https://thumbs.dreamstime.com/b/peles-com-pelo-de-coelho-bege-textura-fundo-da-pele-animal-167583860.jpg')

    // --- MATERIAIS ---
    const white_material = new THREE.MeshStandardMaterial({ map: osso, roughness: 0.9 });
    const grey_material = new THREE.MeshStandardMaterial({ map: escamas, roughness: 0.9 });
    const iris_material = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x330000, roughness: 0.1 });
    const osso_material = new THREE.MeshStandardMaterial({ map: osso, roughness: 0.9 });
    const pelo_material = new THREE.MeshStandardMaterial({ map: pelo, roughness: 0.9 });

    // --- GEOMETRIAS E MESHES ---
    const face_geometry = new THREE.BoxGeometry(85, 20, 50);
    const face = new THREE.Mesh(face_geometry, grey_material);
    face.position.x = -110;
    face.position.y = 40
    grupoMandibula.add(face);

    const face2_geometry = new THREE.BoxGeometry(50, 30, 30);
    const face2 = new THREE.Mesh(face2_geometry, grey_material);
    face2.position.x = -90;
    face2.position.y = 70
    face2.rotation.z = Math.PI / 2+ 1.4;
    grupoCabecaSuperior.add(face2);

    const face3_geometry = new THREE.BoxGeometry(50, 25, 30);
    const face3 = new THREE.Mesh(face3_geometry, grey_material);
    face3.position.x = -130;
    face3.position.y = 68
    face3.rotation.z = Math.PI / 2+ 2;
    grupoCabecaSuperior.add(face3);

    const celha_geometry = new THREE.BoxGeometry(20, 8, 10);
    const celha = new THREE.Mesh(celha_geometry, pelo_material);
    celha.position.x = -78;
    celha.position.y = 78
    celha.position.z = 20
    celha.rotation.z = Math.PI / 2+ 1.9;
    grupoCabecaSuperior.add(celha);

    const celha2_geometry = new THREE.BoxGeometry(20, 8, 10);
    const celha2 = new THREE.Mesh(celha2_geometry, pelo_material);
    celha2.position.x = -65;
    celha2.position.y = 75
    celha2.position.z = 20
    celha2.rotation.z = Math.PI / 2+ 0.9;
    grupoCabecaSuperior.add(celha2);

    const celha4_geometry = new THREE.BoxGeometry(20, 8, 10);
    const celha4 = new THREE.Mesh(celha4_geometry, pelo_material);
    celha4.position.x = -78;
    celha4.position.y = 78
    celha4.position.z = -20
    celha4.rotation.z = Math.PI / 2+ 1.9;
    grupoCabecaSuperior.add(celha4);


    const celha5_geometry = new THREE.BoxGeometry(20, 8, 10);
    const celha5 = new THREE.Mesh(celha5_geometry, pelo_material);
    celha5.position.x = -65;
    celha5.position.y = 75
    celha5.position.z = -20
    celha5.rotation.z = Math.PI / 2+ 0.9;
    grupoCabecaSuperior.add(celha5);

    // Cone

    const cone_geometry = new THREE.ConeGeometry(10, 30, 4);
 

    const cone3 = new THREE.Mesh(cone_geometry, white_material);
    cone3.position.x = -140
    cone3.position.y = 80
    cone3.rotation.z = Math.PI / 2 -2;
	grupoCabecaSuperior.add(cone3);

    const cone4 = new THREE.Mesh(cone_geometry, white_material);
    cone4.position.x = -110
    cone4.position.y = 90
    cone4.rotation.z = Math.PI / 2 -2;
	grupoCabecaSuperior.add(cone4);

    const dente = new THREE.Mesh(cone_geometry, white_material);
    dente.position.x = -130
    dente.position.y = 60
    dente.position.z = 18
    dente.rotation.z = Math.PI +3;
    dente.rotation.x = Math.PI +3.6;
	grupoMandibula.add(dente);

    const dente2 = new THREE.Mesh(cone_geometry, white_material);
    dente2.position.x = -110
    dente2.position.y = 60
    dente2.position.z = 18
    dente2.rotation.z = Math.PI +3;
    dente2.rotation.x = Math.PI -0.8;
	grupoCabecaSuperior.add(dente2);

    const dente3 = new THREE.Mesh(cone_geometry, white_material);
    dente3.position.x = -90
    dente3.position.y = 60
    dente3.position.z = 18
    dente3.rotation.z = Math.PI +3;
    dente3.rotation.x = Math.PI +3.6;
	grupoMandibula.add(dente3);

    const dente4 = new THREE.Mesh(cone_geometry, white_material);
    dente4.position.x = -130
    dente4.position.y = 60
    dente4.position.z = -18
    dente4.rotation.z = Math.PI +3;
    dente4.rotation.x = Math.PI +3.6 - 1;
	grupoMandibula.add(dente4);

    const dente5 = new THREE.Mesh(cone_geometry, white_material);
    dente5.position.x = -110
    dente5.position.y = 60
    dente5.position.z = -18
    dente5.rotation.z = Math.PI +3;
    dente5.rotation.x = Math.PI +0.8;
	grupoCabecaSuperior.add(dente5);

    const dente6 = new THREE.Mesh(cone_geometry, white_material);
    dente6.position.x = -90
    dente6.position.y = 60
    dente6.position.z = -18
    dente6.rotation.z = Math.PI +3;
    dente6.rotation.x = Math.PI +3.6 - 1;
	grupoMandibula.add(dente6);

    const espinho = new THREE.Mesh(cone_geometry, white_material);
    espinho.position.x = -30
    espinho.position.y = 102
    espinho.rotation.z = Math.PI / 4
	dino.add(espinho);

    const espinho2 = new THREE.Mesh(cone_geometry, white_material);
    espinho2.position.x = -10
    espinho2.position.y = 130
    espinho2.rotation.z = Math.PI / 6
	dino.add(espinho2);

    const espinho3 = new THREE.Mesh(cone_geometry, white_material);
    espinho3.position.x = 20
    espinho3.position.y = 140
	dino.add(espinho3);

    const espinho4 = new THREE.Mesh(cone_geometry, white_material);
    espinho4.position.x = 60
    espinho4.position.y = 140
	dino.add(espinho4);

    const espinho5 = new THREE.Mesh(cone_geometry, white_material);
    espinho5.position.x = 100
    espinho5.position.y = 138
    espinho5.rotation.z =- Math.PI / 8
	dino.add(espinho5);

    const espinho6 = new THREE.Mesh(cone_geometry, white_material);
    espinho6.position.x = 130
    espinho6.position.y = 110
    espinho6.rotation.z =- Math.PI / 6
	dino.add(espinho6);

    const garra_geometry = new THREE.ConeGeometry(7, 20, 4);
    const garra = new THREE.Mesh(garra_geometry, white_material);
    garra.position.x = 75
    garra.position.y = -20
    garra.position.z = 45
    garra.rotation.z = Math.PI + Math.PI / 8
	grupopernaa.add(garra);

    const garra2 = new THREE.Mesh(garra_geometry, white_material);
    garra2.position.x = 75
    garra2.position.y = -20
    garra2.position.z = -45
    garra2.rotation.z = Math.PI + Math.PI / 8
	grupopernab.add(garra2);

    const garra3 = new THREE.Mesh(garra_geometry, white_material);
    garra3.position.x = 10
    garra3.position.y = -18
    garra3.position.z = 51
    garra3.rotation.z = Math.PI / 2
	grupopernaa.add(garra3);

    const garra4 = new THREE.Mesh(garra_geometry, white_material);
    garra4.position.x = 10
    garra4.position.y = -18
    garra4.position.z = -51
    garra4.rotation.z = Math.PI / 2
	grupopernab.add(garra4);

    const garra5 = new THREE.Mesh(garra_geometry, white_material);
    garra5.position.x = -18
    garra5.position.y = -20
    garra5.position.z = 36
    garra5.rotation.z = Math.PI / 2
	grupopernaa.add(garra5);

    const garra6 = new THREE.Mesh(garra_geometry, white_material);
    garra6.position.x = -18
    garra6.position.y = -20
    garra6.position.z = -36
    garra6.rotation.z = Math.PI / 2
	grupopernab.add(garra6);

    const garra7 = new THREE.Mesh(garra_geometry, white_material);
    garra7.position.x = -18
    garra7.position.y = -20
    garra7.position.z = 23
    garra7.rotation.z = Math.PI / 2
	grupopernaa.add(garra7);

    const garra8 = new THREE.Mesh(garra_geometry, white_material);
    garra8.position.x = -18
    garra8.position.y = -20
    garra8.position.z = -23
    garra8.rotation.z = Math.PI / 2
	grupopernab.add(garra8);

    // Sphere
    const corpo_geometry = new THREE.BoxGeometry(140, 60, 60);
    const corpo = new THREE.Mesh(corpo_geometry, grey_material);
    corpo.position.x = 50
    corpo.position.y = 85
    dino.add(corpo);

    const corpo2_geometry = new THREE.BoxGeometry(120, 60, 40);
    const corpo2 = new THREE.Mesh(corpo2_geometry, grey_material);
    corpo2.position.x = 50
    corpo2.position.y = 100
    dino.add(corpo2);

    const pescoco_geometry = new THREE.BoxGeometry(40, 40, 23);
    const pescoco = new THREE.Mesh(pescoco_geometry, grey_material);
    pescoco.position.y = 50;
    pescoco.position.x = -50;
    dino.add(pescoco);

    const pescoco2_geometry = new THREE.BoxGeometry(40, 55, 50);
    const pescoco2 = new THREE.Mesh(pescoco2_geometry, grey_material);
    pescoco2.position.y = 65;
    pescoco2.position.x = -20;
    dino.add(pescoco2);

    const cauda_geometry = new THREE.BoxGeometry(40, 55, 50);
    const cauda = new THREE.Mesh(cauda_geometry, grey_material);
    cauda.position.y = 75;
    cauda.position.x = 120;
    dino.add(cauda);

    const cauda2_geometry = new THREE.BoxGeometry(30, 45, 40);
    const cauda2 = new THREE.Mesh(cauda2_geometry, grey_material);
    cauda2.position.y = 55;
    cauda2.position.x = 135;
    dino.add(cauda2);

    const cauda3_geometry = new THREE.BoxGeometry(30, 35, 30);
    const cauda3 = new THREE.Mesh(cauda3_geometry, grey_material);
    cauda3.position.y = 40;
    cauda3.position.x = 145;
    dino.add(cauda3);

    const cauda4_geometry = new THREE.BoxGeometry(20, 25, 20);
    const cauda4 = new THREE.Mesh(cauda4_geometry, grey_material);
    cauda4.position.y = 25;
    cauda4.position.x = 158;
    dino.add(cauda4);

    const cauda5_geometry = new THREE.BoxGeometry(15, 20, 10);
    const cauda5 = new THREE.Mesh(cauda5_geometry, grey_material);
    cauda5.position.y = 18;
    cauda5.position.x = 170;
    dino.add(cauda5);

    const cauda6_geometry = new THREE.BoxGeometry(10, 15, 5);
    const cauda6 = new THREE.Mesh(cauda6_geometry, grey_material);
    cauda6.position.y = 18;
    cauda6.position.x = 180;
    dino.add(cauda6);

    const bracoa_geometry = new THREE.BoxGeometry(18, 30, 20);
    const bracoa = new THREE.Mesh(bracoa_geometry, grey_material);
    bracoa.position.y = 32;
    bracoa.position.x = -15;
    bracoa.position.z = 20
    dino.add(bracoa);

    const bracoa2 = new THREE.Mesh(bracoa_geometry, grey_material);
    bracoa2.position.y = 32;
    bracoa2.position.x = -15;
    bracoa2.position.z = -20
    dino.add(bracoa2);

    const braco_geometry = new THREE.BoxGeometry(15, 25, 20);
    const braco = new THREE.Mesh(braco_geometry, grey_material);
    braco.position.x = -22;
    braco.position.y = 14
    braco.position.z = 20
    braco.rotation.z = Math.PI / 2 + Math.PI / 4
    dino.add(braco);

    const braco2 = new THREE.Mesh(braco_geometry, grey_material);
    braco2.position.x = -22;
    braco2.position.y = 14
    braco2.position.z = -20
    braco2.rotation.z = Math.PI / 2 + Math.PI / 4
    dino.add(braco2);

    const coxa_geometry = new THREE.BoxGeometry(40, 60, 30);
    const coxa = new THREE.Mesh(coxa_geometry, grey_material);
    coxa.position.y = 60;
    coxa.position.x = 60;
    coxa.position.z = 30
    coxa.rotation.z = Math.PI / 2 + Math.PI / 2.5
    dino.add(coxa);

    const coxa2 = new THREE.Mesh(coxa_geometry, grey_material);
    coxa2.position.y = 60;
    coxa2.position.x = 60;
    coxa2.position.z = -30
    coxa2.rotation.z = Math.PI / 2 + Math.PI / 2.5
    dino.add(coxa2);

    const coxaf_geometry = new THREE.BoxGeometry(30, 40, 30);
    const coxa3 = new THREE.Mesh(coxaf_geometry, grey_material);
    coxa3.position.y = 60;
    coxa3.position.x = 60;
    coxa3.position.z = 40
    coxa3.rotation.z = Math.PI / 2 + Math.PI / 2.5
    dino.add(coxa3);

    const coxa4 = new THREE.Mesh(coxaf_geometry, grey_material);
    coxa4.position.y = 60;
    coxa4.position.x = 60;
    coxa4.position.z = -40
    coxa4.rotation.z = Math.PI / 2 + Math.PI / 2.5
    dino.add(coxa4);

    const perna_geometry = new THREE.BoxGeometry(30, 60, 30);
    const perna = new THREE.Mesh(perna_geometry, grey_material);
    perna.position.y = 20
    perna.position.x = 60;
    perna.position.z = 30
    perna.rotation.z = Math.PI / 10
    grupopernaa.add(perna);

    const perna2 = new THREE.Mesh(perna_geometry, grey_material);
    perna2.position.y = 20
    perna2.position.x = 60;
    perna2.position.z = -30
    perna2.rotation.z = Math.PI / 10
    grupopernab.add(perna2);

    const garrape_geometry = new THREE.BoxGeometry(15, 50, 15);
    const garrape = new THREE.Mesh(garrape_geometry, grey_material);
    garrape.position.y = 10
    garrape.position.x = 63;
    garrape.position.z = 45
    garrape.rotation.z = Math.PI / 10
    grupopernaa.add(garrape);

    const garrape2 = new THREE.Mesh(garrape_geometry, grey_material);
    garrape2.position.y = 10
    garrape2.position.x = 63;
    garrape2.position.z = -45
    garrape2.rotation.z = Math.PI / 10
    grupopernab.add(garrape2);

    const pe_geometry = new THREE.BoxGeometry(20, 50, 30);
    const pe = new THREE.Mesh(pe_geometry, grey_material);
    pe.position.y = -5
    pe.position.x = 55;
    pe.position.z = 30
    pe.rotation.z = Math.PI / 2 + Math.PI / 5
    grupopernaa.add(pe);

    const pe2 = new THREE.Mesh(pe_geometry, grey_material);
    pe2.position.y = -5
    pe2.position.x = 55;
    pe2.position.z = -30
    pe2.rotation.z = Math.PI / 2 + Math.PI / 5
    grupopernab.add(pe2);

    const ppe_geometry = new THREE.BoxGeometry(18, 30, 30);
    const pe3 = new THREE.Mesh(ppe_geometry, grey_material);
    pe3.position.y = -18
    pe3.position.x = 27;
    pe3.position.z = 30
    pe3.rotation.z = Math.PI / 2 
    grupopernaa.add(pe3);

    const pe4 = new THREE.Mesh(ppe_geometry, grey_material);
    pe4.position.y = -18
    pe4.position.x = 27;
    pe4.position.z = -30
    pe4.rotation.z = Math.PI / 2
    grupopernab.add(pe4);

    const pppe_geometry = new THREE.BoxGeometry(14, 20, 30);
    const pe5 = new THREE.Mesh(pppe_geometry, grey_material);
    pe5.position.y = -18
    pe5.position.x = 27;
    pe5.position.z = 43
    pe5.rotation.z = Math.PI / 2 
    grupopernaa.add(pe5);

    const pe6 = new THREE.Mesh(pppe_geometry, grey_material);
    pe6.position.y = -18
    pe6.position.x = 27;
    pe6.position.z = -43
    pe6.rotation.z = Math.PI / 2
    grupopernab.add(pe6);

    const falange_geometry = new THREE.BoxGeometry(15, 16, 12);
    const falange = new THREE.Mesh(falange_geometry, grey_material);
    falange.position.y = -14
    falange.position.x = 10;
    falange.position.z = 36
    falange.rotation.z = Math.PI / 2 
    grupopernaa.add(falange);

    const falange2 = new THREE.Mesh(falange_geometry, grey_material);
    falange2.position.y = -14
    falange2.position.x = 10;
    falange2.position.z = -36
    falange2.rotation.z = Math.PI / 2
    grupopernab.add(falange2);

    const falange3 = new THREE.Mesh(falange_geometry, grey_material);
    falange3.position.y = -14
    falange3.position.x = 10;
    falange3.position.z = 23
    falange3.rotation.z = Math.PI / 2 
    grupopernaa.add(falange3);

    const falange4 = new THREE.Mesh(falange_geometry, grey_material);
    falange4.position.y = -14
    falange4.position.x = 10;
    falange4.position.z = -23
    falange4.rotation.z = Math.PI / 2
    grupopernab.add(falange4);

    const falange5 = new THREE.Mesh(falange_geometry, grey_material);
    falange5.position.y = -20
    falange5.position.z = 36
    falange5.rotation.z = Math.PI / 2 
    grupopernaa.add(falange5);

    const falange6 = new THREE.Mesh(falange_geometry, grey_material);
    falange6.position.y = -20
    falange6.position.z = -36
    falange6.rotation.z = Math.PI / 2
    grupopernab.add(falange6);

    const falange7 = new THREE.Mesh(falange_geometry, grey_material);
    falange7.position.y = -20
    falange7.position.z = 23
    falange7.rotation.z = Math.PI / 2 
    grupopernaa.add(falange7);

    const falange8 = new THREE.Mesh(falange_geometry, grey_material);
    falange8.position.y = -20
    falange8.position.z = -23
    falange8.rotation.z = Math.PI / 2
    grupopernab.add(falange8);

    const eye_geometry = new THREE.SphereGeometry(10, 30, 30);
    const eye = new THREE.Mesh(eye_geometry, white_material);
    eye.position.x= -75
    eye.position.y = 68
    eye.position.z=15
    grupoCabecaSuperior.add(eye);

    const eye2 = new THREE.Mesh(eye_geometry, white_material);
    eye2.position.x= -75
    eye2.position.y = 68
    eye2.position.z=-15
    grupoCabecaSuperior.add(eye2);

    const iris_geometry = new THREE.SphereGeometry(5, 30, 30);
    const iris = new THREE.Mesh(iris_geometry, iris_material);
    iris.position.x= -75
    iris.position.y = 68
    iris.position.z=21
    grupoCabecaSuperior.add(iris);

    const iris2 = new THREE.Mesh(iris_geometry, iris_material);
    iris2.position.x= -75
    iris2.position.y = 68
    iris2.position.z=-21
    grupoCabecaSuperior.add(iris2);

    return {
        model: dino,
        parts: {
            grupoMandibula,
            grupoCabecaSuperior,
            grupopernaa,
            grupopernab,
            iris,
            iris2,
            pescoco,
            pescoco2,
            cauda, cauda2, cauda3, cauda4, cauda5, cauda6,
            corpo, corpo2,
            braco, braco2, bracoa, bracoa2,
            coxa, coxa2, coxa3, coxa4,
            espinho, espinho2, espinho3, espinho4, espinho5, espinho6
        }
    };
}