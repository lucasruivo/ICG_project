import * as THREE from 'three';

export function createCact() {
    const cact = new THREE.Group();

    const material = new THREE.MeshStandardMaterial({
        color: 0x2e8b57,
        roughness: 0.85,
        metalness: 0.0,
    });
    
    // Corrigir altura: subir o cacto para não ficar enfiado no chão
    const mainBody = new THREE.Mesh(new THREE.CylinderGeometry(10, 7, 60, 12), material);
    mainBody.position.y = 30; // metade da altura do cilindro
    cact.add(mainBody);

    const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(7, 5, 25, 12), material);
    arm1.position.set(-10, 30, 0);
    arm1.rotation.z = Math.PI / 4;
    cact.add(arm1);

    const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(7, 5, 30, 12), material);
    arm2.position.set(10, 40, 0);
    arm2.rotation.z = -Math.PI / 4 +0.1; // ligeira inclinação para dar mais naturalidade
    cact.add(arm2);


    return cact;
}