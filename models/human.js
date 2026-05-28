import * as THREE from 'three';

export function createHuman() {
    const human = new THREE.Group();

    const woodMaterial = new THREE.MeshStandardMaterial({
        color: 0xdbb98e,
        roughness: 0.82,
        metalness: 0.0,
    });

    const accentMaterial = new THREE.MeshStandardMaterial({
        color: 0xcfa979,
        roughness: 0.9,
        metalness: 0.0,
    });

    // Articulação esférica
    function addJoint(parent, radius, x, y, z = 0) {
        const joint = new THREE.Mesh(new THREE.SphereGeometry(radius, 16, 12), woodMaterial);
        joint.position.set(x, y, z);
        parent.add(joint);
        return joint;
    }

    // Segmento cilíndrico
    function addCapsule(parent, radiusTop, radiusBottom, height, x, y, z = 0, rotX = 0, rotY = 0, rotZ = 0) {
        const segment = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 16), woodMaterial);
        segment.position.set(x, y, z);
        segment.rotation.set(rotX, rotY, rotZ);
        parent.add(segment);
        return segment;
    }

    // Cabeça e âncora da câmara FPV
    const head = new THREE.Mesh(new THREE.CapsuleGeometry(2.2, 2.5, 8, 16), woodMaterial);
    head.position.set(0, 32, 0);
    head.scale.set(1.0, 1.12, 0.9);
    human.add(head);

    const cameraAnchor = new THREE.Object3D();
    cameraAnchor.position.set(0, 32.2, 5.5);
    human.add(cameraAnchor);

    addJoint(human, 1.05, 0, 27.6);

    // Torso e pélvis
    addCapsule(human, 2.35, 2.75, 8.6, 0, 22.5);

    const chestAccent = new THREE.Mesh(new THREE.SphereGeometry(1.55, 14, 10), accentMaterial);
    chestAccent.position.set(0, 22.4, 1.2);
    chestAccent.scale.set(1.2, 1.8, 0.45);
    human.add(chestAccent);

    addJoint(human, 1.18, 0, 17.2);

    const pelvis = addCapsule(human, 2.25, 2.55, 5.6, 0, 13.8);
    pelvis.scale.z = 0.9;

    const pelvisAccent = new THREE.Mesh(new THREE.SphereGeometry(1.2, 12, 10), accentMaterial);
    pelvisAccent.position.set(0, 13.7, 1.0);
    pelvisAccent.scale.set(1.2, 1.35, 0.4);
    human.add(pelvisAccent);

    // Perna esquerda (pivô na anca)
    const leftLeg = new THREE.Group();
    leftLeg.position.set(-1.25, 10.5, 0);
    human.add(leftLeg);

    addJoint(leftLeg, 0.96, 0, 0, 0);
    addCapsule(leftLeg, 1.0, 0.8, 7.6, 0, -4.3, 0);
    addJoint(leftLeg, 0.8, 0, -8.7, 0);
    addCapsule(leftLeg, 0.82, 0.66, 8, 0, -13.4, 0);
    addJoint(leftLeg, 0.62, 0, -17.7, 0);

    const leftFoot = new THREE.Mesh(new THREE.CapsuleGeometry(1.1, 3, 14, 12), woodMaterial);
    leftFoot.position.set(0, -19.15, 0.45);
    leftFoot.rotation.z = Math.PI / 2;
    leftFoot.rotation.y = Math.PI / 2;
    leftFoot.scale.set(1.0, 0.72, 0.9);
    leftLeg.add(leftFoot);

    // Perna direita (pivô na anca)
    const rightLeg = new THREE.Group();
    rightLeg.position.set(1.25, 10.5, 0);
    human.add(rightLeg);

    addJoint(rightLeg, 0.96, 0, 0, 0);
    addCapsule(rightLeg, 1.0, 0.8, 7.6, 0, -4.3, 0);
    addJoint(rightLeg, 0.8, 0, -8.7, 0);
    addCapsule(rightLeg, 0.82, 0.66, 8, 0, -13.4, 0);
    addJoint(rightLeg, 0.62, 0, -17.7, 0);

    const rightFoot = new THREE.Mesh(new THREE.CapsuleGeometry(1.1, 3, 14, 12), woodMaterial);
    rightFoot.position.set(0, -19.15, 0.45);
    rightFoot.rotation.z = Math.PI / 2;
    rightFoot.rotation.y = Math.PI / 2;
    rightFoot.scale.set(1.0, 0.72, 0.9);
    rightLeg.add(rightFoot);

    // Braço esquerdo (pivô no ombro)
    const leftArm = new THREE.Group();
    leftArm.position.set(-3.35, 24.9, 0);
    human.add(leftArm);

    addJoint(leftArm, 1.12, 0, 0, 0);
    addCapsule(leftArm, 0.95, 0.8, 6.4, -0.65, -4.1, 0, 0, 0, Math.PI * -0.03);
    addJoint(leftArm, 0.82, -1.15, -7.8, 0);
    addCapsule(leftArm, 0.8, 0.68, 6.2, -0.95, -11.6, 0, 0, 0, Math.PI * 0.02);
    addJoint(leftArm, 0.62, -0.75, -15.1, 0);

    // Braço direito (pivô no ombro)
    const rightArm = new THREE.Group();
    rightArm.position.set(3.35, 24.9, 0);
    human.add(rightArm);

    addJoint(rightArm, 1.12, 0, 0, 0);
    addCapsule(rightArm, 0.95, 0.8, 6.4, 0.65, -4.1, 0, 0, 0, -Math.PI * -0.03);
    addJoint(rightArm, 0.82, 1.15, -7.8, 0);
    addCapsule(rightArm, 0.8, 0.68, 6.2, 0.95, -11.6, 0, 0, 0, Math.PI * -0.02);
    addJoint(rightArm, 0.62, 0.75, -15.1, 0);

    human.scale.setScalar(2);

    // Ajusta a altura da base ao chão
    const bbox = new THREE.Box3().setFromObject(human);
    human.position.y -= bbox.min.y;

    // Guarda referências para animação
    human.userData.leftLeg = leftLeg;
    human.userData.rightLeg = rightLeg;
    human.userData.leftArm = leftArm;
    human.userData.rightArm = rightArm;

    human.userData.draggable = true;
    human.userData.cameraAnchor = cameraAnchor;
    human.userData.collisionCircles = [
        { x: 0, z: 0.2, r: 3.4 }
    ];
    human.name = 'Human';

    return human;
}
