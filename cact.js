import * as THREE from 'three';

export function createCact() {
    const cact = new THREE.Group();

    // Material verde do cacto (com flatShading para simular as "costelas" verticais)
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x2e8b57,
        roughness: 0.9,
        metalness: 0.0,
        flatShading: true 
    });

    // Material claro para os espinhos
    const spikeMaterial = new THREE.MeshStandardMaterial({
        color: 0xebe3c5, // Tom osso/amarelado
        roughness: 0.8,
    });

    // --- CORPO PRINCIPAL ---
    const mainRadius = 8;
    const mainHeight = 60;
    
    // Tronco
    const mainBody = new THREE.Mesh(new THREE.CylinderGeometry(mainRadius, mainRadius, mainHeight, 8), bodyMaterial);
    mainBody.position.y = mainHeight / 2; // Sobe para o chão
    cact.add(mainBody);

    // Cúpula no topo do tronco
    const mainTop = new THREE.Mesh(new THREE.SphereGeometry(mainRadius, 8, 8), bodyMaterial);
    mainTop.position.y = mainHeight;
    cact.add(mainTop);


    // --- FUNÇÃO PARA ADICIONAR PICOS ---
    // Criamos a geometria do pico uma vez (um cone apontado para a frente)
    const spikeGeo = new THREE.ConeGeometry(0.6, 4, 4);
    spikeGeo.rotateX(Math.PI / 2); // Deita o cone para apontar no eixo Z

    function addSpikes(parentMesh, radius, height, rows, spikesPerRow) {
        for (let r = 0; r < rows; r++) {
            // Calcula a altura de cada linha de picos
            const yPos = (r / rows) * height - (height / 2) + (height / rows / 2);
            
            for (let s = 0; s < spikesPerRow; s++) {
                // Alternar a rotação entre linhas para os picos não ficarem todos alinhados
                const angle = (s / spikesPerRow) * Math.PI * 2 + (r % 2) * 0.4; 
                
                const spike = new THREE.Mesh(spikeGeo, spikeMaterial);
                
                // Roda o pico para a direção correta
                spike.rotation.y = angle;
                
                // Move o pico para a superfície do cilindro (o eixo Z local já foi rodado)
                spike.translateZ(radius); 
                spike.position.y = yPos;
                
                parentMesh.add(spike);
            }
        }
    }


    // --- BRAÇO DIREITO ---
    const armGroup1 = new THREE.Group();
    const arm1Radius = 5;
    
    // Extensão horizontal
    const arm1H = new THREE.Mesh(new THREE.CylinderGeometry(arm1Radius, arm1Radius, 15, 8), bodyMaterial);
    arm1H.rotation.z = Math.PI / 2;
    arm1H.position.set(7.5, 0, 0);
    armGroup1.add(arm1H);
    
    // "Cotovelo" arredondado
    const elbow1 = new THREE.Mesh(new THREE.SphereGeometry(arm1Radius, 8, 8), bodyMaterial);
    elbow1.position.set(15, 0, 0);
    armGroup1.add(elbow1);
    
    // Extensão vertical
    const arm1V = new THREE.Mesh(new THREE.CylinderGeometry(arm1Radius, arm1Radius, 25, 8), bodyMaterial);
    arm1V.position.set(15, 12.5, 0);
    armGroup1.add(arm1V);
    
    // Topo do braço
    const top1 = new THREE.Mesh(new THREE.SphereGeometry(arm1Radius, 8, 8), bodyMaterial);
    top1.position.set(15, 25, 0);
    armGroup1.add(top1);

    // Colocar o braço no tronco
    armGroup1.position.set(mainRadius - 2, 25, 0); 
    cact.add(armGroup1);


    // --- BRAÇO ESQUERDO (Mais pequeno e mais alto para assimetria natural) ---
    const armGroup2 = new THREE.Group();
    const arm2Radius = 4.5;
    
    const arm2H = new THREE.Mesh(new THREE.CylinderGeometry(arm2Radius, arm2Radius, 12, 8), bodyMaterial);
    arm2H.rotation.z = Math.PI / 2;
    arm2H.position.set(-6, 0, 0);
    armGroup2.add(arm2H);
    
    const elbow2 = new THREE.Mesh(new THREE.SphereGeometry(arm2Radius, 8, 8), bodyMaterial);
    elbow2.position.set(-12, 0, 0);
    armGroup2.add(elbow2);
    
    const arm2V = new THREE.Mesh(new THREE.CylinderGeometry(arm2Radius, arm2Radius, 30, 8), bodyMaterial);
    arm2V.position.set(-12, 15, 0);
    armGroup2.add(arm2V);
    
    const top2 = new THREE.Mesh(new THREE.SphereGeometry(arm2Radius, 8, 8), bodyMaterial);
    top2.position.set(-12, 30, 0);
    armGroup2.add(top2);

    // Colocar o braço no tronco (lado esquerdo)
    armGroup2.position.set(-mainRadius + 2, 35, 0); 
    cact.add(armGroup2);


    // --- DISTRIBUIR OS PICOS ---
    // (Alvo, Raio, Altura, Linhas, Picos por linha)
    addSpikes(mainBody, mainRadius, mainHeight, 10, 8); // Picos no corpo central
    addSpikes(arm1V, arm1Radius, 25, 5, 6);             // Picos no braço direito
    addSpikes(arm2V, arm2Radius, 30, 6, 6);             // Picos no braço esquerdo

    // Configurações finais para o raycaster funcionar
    cact.name = "Cacto";
    cact.userData.draggable = true;

    return cact;
}