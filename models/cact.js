import * as THREE from 'three';

export function createCact() {
    const cact = new THREE.Group();

    // Material do corpo
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x2e8b57,
        roughness: 0.9,
        metalness: 0.0,
        flatShading: true 
    });

    // Material dos espinhos
    const spikeMaterial = new THREE.MeshStandardMaterial({
        color: 0xebe3c5,
        roughness: 0.8,
    });

    // Corpo central
    const mainRadius = 8;
    const mainHeight = 60;
    
    const mainBody = new THREE.Mesh(new THREE.CylinderGeometry(mainRadius, mainRadius, mainHeight, 8), bodyMaterial);
    mainBody.position.y = mainHeight / 2;
    cact.add(mainBody);

    const mainTop = new THREE.Mesh(new THREE.SphereGeometry(mainRadius, 8, 8), bodyMaterial);
    mainTop.position.y = mainHeight;
    cact.add(mainTop);

    // Geometria básica dos espinhos (cones deitados no eixo Z)
    const spikeGeo = new THREE.ConeGeometry(0.6, 4, 4);
    spikeGeo.rotateX(Math.PI / 2);

    // Função para gerar espinhos em espiral ao redor dos braços/corpo
    function addSpikes(parentMesh, radius, height, rows, spikesPerRow) {
        for (let r = 0; r < rows; r++) {
            const yPos = (r / rows) * height - (height / 2) + (height / rows / 2);
            
            for (let s = 0; s < spikesPerRow; s++) {
                const angle = (s / spikesPerRow) * Math.PI * 2 + (r % 2) * 0.4; 
                
                const spike = new THREE.Mesh(spikeGeo, spikeMaterial);
                spike.rotation.y = angle;
                spike.translateZ(radius); 
                spike.position.y = yPos;
                
                parentMesh.add(spike);
            }
        }
    }

    // Braço direito
    const armGroup1 = new THREE.Group();
    const arm1Radius = 5;
    
    const arm1H = new THREE.Mesh(new THREE.CylinderGeometry(arm1Radius, arm1Radius, 15, 8), bodyMaterial);
    arm1H.rotation.z = Math.PI / 2;
    arm1H.position.set(7.5, 0, 0);
    armGroup1.add(arm1H);
    
    const elbow1 = new THREE.Mesh(new THREE.SphereGeometry(arm1Radius, 8, 8), bodyMaterial);
    elbow1.position.set(15, 0, 0);
    armGroup1.add(elbow1);
    
    const arm1V = new THREE.Mesh(new THREE.CylinderGeometry(arm1Radius, arm1Radius, 25, 8), bodyMaterial);
    arm1V.position.set(15, 12.5, 0);
    armGroup1.add(arm1V);
    
    const top1 = new THREE.Mesh(new THREE.SphereGeometry(arm1Radius, 8, 8), bodyMaterial);
    top1.position.set(15, 25, 0);
    armGroup1.add(top1);

    armGroup1.position.set(mainRadius - 2, 25, 0); 
    cact.add(armGroup1);

    // Braço esquerdo (menor e mais alto para assimetria)
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

    armGroup2.position.set(-mainRadius + 2, 35, 0); 
    cact.add(armGroup2);

    // Distribuição final dos espinhos
    addSpikes(mainBody, mainRadius, mainHeight, 10, 8);
    addSpikes(arm1V, arm1Radius, 25, 5, 6);
    addSpikes(arm2V, arm2Radius, 30, 6, 6);

    cact.name = "Cacto";
    cact.userData.draggable = true;
    cact.userData.collisionCircles = [
        { x: 0, z: 0, r: 8 }
    ];

    return cact;
}