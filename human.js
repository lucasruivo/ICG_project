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

    function addJoint(radius, x, y, z = 0) {
        const joint = new THREE.Mesh(new THREE.SphereGeometry(radius, 16, 12), woodMaterial);
        joint.position.set(x, y, z);
        human.add(joint);
        return joint;
    }

    function addCapsule(radiusTop, radiusBottom, height, x, y, z = 0, rotX = 0, rotY = 0, rotZ = 0) {
        const segment = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 16), woodMaterial);
        segment.position.set(x, y, z);
        segment.rotation.set(rotX, rotY, rotZ);
        human.add(segment);
        return segment;
    }

    // Head and neck.
    const head = new THREE.Mesh(new THREE.CapsuleGeometry(2.2, 2.5, 8, 16), woodMaterial);
    head.position.set(0, 32, 0);
    head.scale.set(1.0, 1.12, 0.9);
    human.add(head);

    addJoint(1.05, 0, 27.6);

    // Torso and pelvis.
    addCapsule(2.35, 2.75, 8.6, 0, 22.5);

    const chestAccent = new THREE.Mesh(new THREE.SphereGeometry(1.55, 14, 10), accentMaterial);
    chestAccent.position.set(0, 22.4, 1.2);
    chestAccent.scale.set(1.2, 1.8, 0.45);
    human.add(chestAccent);

    addJoint(1.18, 0, 17.2);

    const pelvis = addCapsule(2.25, 2.55, 5.6, 0, 13.8);
    pelvis.scale.z = 0.9;

    const pelvisAccent = new THREE.Mesh(new THREE.SphereGeometry(1.2, 12, 10), accentMaterial);
    pelvisAccent.position.set(0, 13.7, 1.0);
    pelvisAccent.scale.set(1.2, 1.35, 0.4);
    human.add(pelvisAccent);

    // Arms (both down, connected shoulder -> elbow -> wrist).
    addJoint(1.12, -3.35, 24.9);
    addJoint(1.12, 3.35, 24.9);

    addCapsule(0.95, 0.8, 6.4, -4, 20.8, 0, 0, 0, Math.PI * -0.03);
    addCapsule(0.95, 0.8, 6.4, 4, 20.8, 0, 0, 0, -Math.PI * -0.03);

    addJoint(0.82, -4.5, 17.1);
    addJoint(0.82, 4.5, 17.1);

    addCapsule(0.8, 0.68, 6.2, -4.3, 13.3, 0, 0, 0, Math.PI * 0.02);
    addCapsule(0.8, 0.68, 6.2, 4.3, 13.3, 0, 0, 0, -Math.PI * 0.02);

    addJoint(0.62, -4.1, 9.8);
    addJoint(0.62, 4.1, 9.8);

    // Legs.
    addJoint(0.96, -1.25, 10.5);
    addJoint(0.96, 1.25, 10.5);

    addCapsule(1.0, 0.8, 7.6, -1.25, 6.2);
    addCapsule(1.0, 0.8, 7.6, 1.25, 6.2);

    addJoint(0.8, -1.25, 1.8);
    addJoint(0.8, 1.25, 1.8);

    addCapsule(0.82, 0.66, 8, -1.25, -2.9);
    addCapsule(0.82, 0.66, 8, 1.25, -2.9);

    addJoint(0.62, -1.25, -7.2);
    addJoint(0.62, 1.25, -7.2);

    const leftFoot = new THREE.Mesh(new THREE.CapsuleGeometry(1.1, 3, 14, 12), woodMaterial);
    leftFoot.position.set(-1.25, -8.65, 0.45);
    leftFoot.rotation.z = Math.PI / 2;
    leftFoot.rotation.y = Math.PI / 2;
    leftFoot.scale.set(1.0, 0.72, 0.9);
    human.add(leftFoot);

    const rightFoot = new THREE.Mesh(new THREE.CapsuleGeometry(1.1, 3, 14, 12), woodMaterial);
    rightFoot.position.set(1.35, -8.65, 0.45);
    rightFoot.rotation.z = Math.PI / 2;
    rightFoot.rotation.y = Math.PI / 2;
    rightFoot.scale.set(1.0, 0.72, 0.9);
    human.add(rightFoot);

    human.scale.setScalar(2);

    // Keep exact floor contact at local y = 0.
    const bbox = new THREE.Box3().setFromObject(human);
    human.position.y -= bbox.min.y;

    human.userData.draggable = true;
    human.userData.groundOffset = 19.0;
    human.name = 'Human';

    return human;
}
