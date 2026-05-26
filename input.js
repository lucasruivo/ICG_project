import * as THREE from 'three';

/**
 * Setup and bind all keyboard and mouse event listeners for scenario editing and first-person human control.
 * Uses a shared state object to communicate mutations with the main module.
 * @param {Object} state - The shared state object containing references and getters/setters.
 * @returns {Object} A destroy object containing a cleanup function.
 */
export function setupInput(state) {
    const renderer = state.renderer;
    const scene = state.scene;
    const camera = state.camera;
    const raycaster = state.raycaster;
    const mouse = state.mouse;
    const dragPlane = state.dragPlane;
    const intersectionPoint = state.intersectionPoint;
    const humanControlSettings = state.humanControlSettings;
    const humanMoveState = state.humanMoveState;

    let preDragState = null;

    // Helper functions
    function getSceneRootObject(object) {
        let root = object;
        while (root.parent && root.parent !== scene) {
            root = root.parent;
        }
        return root;
    }

    function getInteractiveObjectFromIntersections(intersections) {
        for (const hit of intersections) {
            const rootObject = getSceneRootObject(hit.object);
            if (rootObject === state.terrain) continue;
            if (rootObject.userData?.draggable === false) continue;
            if (rootObject.userData?.ignoreSceneTools) continue;
            return rootObject;
        }
        return null;
    }

    function getMouseNDC(event) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    // Register a global picked object clearer to link with scenario logic
    window.clearPickedObject = () => {
        state.lastPickedObject = null;
    };

    // 1. Mousedown (dragging initialization or deletion)
    const onMouseDown = (event) => {
        if (state.humanControlMode) return;

        getMouseNDC(event);
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(scene.children, true);
        const object = getInteractiveObjectFromIntersections(intersects);

        if (!object) {
            if (event.button === 0) state.lastPickedObject = null;
            return;
        }

        if (event.pointerType === 'touch' || event.button === 0) {
            state.lastPickedObject = object;

            if (state.deleteMode) {
                // Guardar histórico antes de apagar
                state.saveHistoryState();
                const removed = state.removeScenarioObject(object);
                if (removed) {
                    console.log('Objeto removido do cenário.');
                    if (state.lastPickedObject === object) {
                        window.clearPickedObject();
                    }
                }
                return;
            }

            // Capturar estado inicial pré-drag
            preDragState = JSON.stringify(state.serializeScenario());

            state.selectedObject = object;
            state.isDragging = true;
            state.movementSpeed = 4.0;
            state.controls.enabled = false;

            // Lift object slightly when picking it up
            state.selectedObject.position.y += 30;
            dragPlane.constant = -state.selectedObject.position.y;

            // Remove old outline if it exists
            if (state.selectionOutline) {
                state.selectionOutline.traverse((child) => {
                    if (child.userData.isOutline) {
                        child.parent?.remove(child);
                    }
                });
            }

            // Create new outline on the selected mesh
            state.selectionOutline = new THREE.Group();
            state.selectionOutline.userData.isSelectionOutline = true;
            state.selectedObject.traverse((child) => {
                if (child.isMesh) {
                    const outline = state.createModelOutline(child);
                    if (outline) {
                        outline.userData.isOutline = true;
                        child.add(outline);
                    }
                }
            });
            state.selectionOutline.visible = true;
            if (state.selectionBox) state.selectionBox.visible = false;
        }
    };
    renderer.domElement.addEventListener('pointerdown', onMouseDown);

    // 2. Mousemove (drag movement)
    const onMouseMove = (event) => {
        if (state.humanControlMode) return;
        if (!state.isDragging || !state.selectedObject) return;

        getMouseNDC(event);
        raycaster.setFromCamera(mouse, camera);

        if (raycaster.ray.intersectPlane(dragPlane, intersectionPoint)) {
            state.selectedObject.position.x = intersectionPoint.x;
            state.selectedObject.position.z = intersectionPoint.z;
            if (state.selectionBox) state.selectionBox.update();
        }
    };
    window.addEventListener('pointermove', onMouseMove);

    // 3. Mouseup (releasing drag)
    const onMouseUp = (event) => {
        if (state.humanControlMode) return;

        if (state.isDragging && state.selectedObject && (event.pointerType === 'touch' || event.button === 0)) {
            state.snapObjectToTerrain(state.selectedObject);
            if (state.selectedObject.name === 'Pond') {
                state.updateTerrainHeights();
            }
            if (state.selectedObject.name === 'Tumbleweed') {
                state.selectedObject.userData.jumpHeight = 0;
                state.selectedObject.userData.jumpVelocity = 0;
                state.selectedObject.userData.nextJumpAt = Date.now() + 1000 + Math.random() * 2500;
            }
            dragPlane.constant = -state.selectedObject.position.y;
            if (state.selectionOutline) {
                state.selectedObject.traverse((child) => {
                    if (child.isMesh) {
                        for (let i = child.children.length - 1; i >= 0; i--) {
                            const subchild = child.children[i];
                            if (subchild.userData.isOutline) {
                                child.remove(subchild);
                            }
                        }
                    }
                });
            }

            // Comparar estado pós-drag com pré-drag e salvar no histórico se mudou
            const postDragState = JSON.stringify(state.serializeScenario());
            if (preDragState && postDragState !== preDragState) {
                state.undoStack.push(preDragState);
                if (state.undoStack.length > state.MAX_HISTORY) {
                    state.undoStack.shift();
                }
                state.redoStack.length = 0; // Limpa redo
                state.updateHistoryButtons();
            }
            preDragState = null;
        }
        state.isDragging = false;
        state.selectedObject = null;
        state.movementSpeed = 1.0;
        state.controls.enabled = true;
        state.autoSaveScenario();
    };
    window.addEventListener('pointerup', onMouseUp);

    // 4. Wheel (rotation during drag)
    const onWheel = (event) => {
        if (state.humanControlMode) return;
        if (!state.isDragging || !state.selectedObject) return;

        const delta = event.deltaY > 0 ? 0.2 : -0.2;
        state.selectedObject.rotation.y += delta;
        state.autoSaveScenario();
        event.preventDefault();
    };
    window.addEventListener('wheel', onWheel, { passive: false });

    // 5. Keydown editor keyboard hotkeys
    const onKeyDownEditor = (event) => {
        if (state.humanControlMode) return;

        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const modifier = isMac ? event.metaKey : event.ctrlKey;

        // Atalhos de Undo / Redo (apenas se não estiver a arrastar)
        if (!state.isDragging && modifier) {
            if (event.key.toLowerCase() === 'z') {
                if (event.shiftKey) {
                    // Redo: Cmd+Shift+Z ou Ctrl+Shift+Z
                    state.redo();
                } else {
                    // Undo: Cmd+Z ou Ctrl+Z
                    state.undo();
                }
                event.preventDefault();
                return;
            }
            if (event.key.toLowerCase() === 'y') {
                // Redo: Cmd+Y ou Ctrl+Y
                state.redo();
                event.preventDefault();
                return;
            }
        }

        if (state.isDragging && state.selectedObject) {
            if (event.code === 'KeyW') {
                state.scaleObjectPreservingBottom(state.selectedObject, (object3D) => {
                    object3D.scale.multiplyScalar(1.05);
                }, { updateDragPlane: true });
                event.preventDefault();
                return;
            }
            if (event.code === 'KeyS') {
                state.scaleObjectPreservingBottom(state.selectedObject, (object3D) => {
                    object3D.scale.multiplyScalar(0.95);
                }, { updateDragPlane: true });
                event.preventDefault();
                return;
            }
            if (event.code === 'KeyA') {
                state.selectedObject.rotation.y -= 0.1;
                event.preventDefault();
                return;
            }
            if (event.code === 'KeyD') {
                state.selectedObject.rotation.y += 0.1;
                event.preventDefault();
                return;
            }
        }

        const isDeleteKey = event.key === 'Delete' || event.key === 'Backspace';
        if (isDeleteKey && !state.isDragging && state.lastPickedObject) {
            state.saveHistoryState();
            const removed = state.removeScenarioObject(state.lastPickedObject);
            if (removed) {
                console.log('Objeto removido por teclado.');
                window.clearPickedObject();
            }
        }
    };
    window.addEventListener('keydown', onKeyDownEditor);

    // 6. Mousemove human camera look direction
    const onMouseMoveHuman = (event) => {
        if (!state.humanControlMode) return;
        if (document.pointerLockElement !== renderer.domElement) return;

        state.humanYaw -= event.movementX * humanControlSettings.mouseSensitivity;
        state.humanPitch -= event.movementY * humanControlSettings.mouseSensitivity;
        state.humanPitch = THREE.MathUtils.clamp(
            state.humanPitch,
            -humanControlSettings.maxPitch,
            humanControlSettings.maxPitch
        );
    };
    window.addEventListener('mousemove', onMouseMoveHuman);

    // 7. Keydown human modes & keyboard movements
    const onKeyDownHuman = (event) => {
        if (event.code === 'KeyF') {
            if (state.humanControlMode) {
                state.exitHumanControlMode();
            } else {
                state.enterHumanControlMode();
            }
            event.preventDefault();
            return;
        }

        if (event.code === 'Escape' && state.humanControlMode) {
            state.exitHumanControlMode();
            event.preventDefault();
            return;
        }

        if (!state.humanControlMode) return;

        switch (event.code) {
            case 'KeyW': humanMoveState.forward = true; event.preventDefault(); break;
            case 'KeyS': humanMoveState.backward = true; event.preventDefault(); break;
            case 'KeyA': humanMoveState.left = true; event.preventDefault(); break;
            case 'KeyD': humanMoveState.right = true; event.preventDefault(); break;
            case 'KeyE':
                if (state.triggerFishing && typeof state.triggerFishing === 'function') {
                    state.triggerFishing();
                }
                event.preventDefault();
                break;
            case 'Space':
                if (state.humanCanJump) {
                    state.humanVerticalVelocity = humanControlSettings.jumpSpeed;
                    state.humanCanJump = false;
                }
                event.preventDefault();
                break;
        }
    };
    window.addEventListener('keydown', onKeyDownHuman);

    // 8. Keyup human movements
    const onKeyUpHuman = (event) => {
        if (!state.humanControlMode) return;

        switch (event.code) {
            case 'KeyW': humanMoveState.forward = false; break;
            case 'KeyS': humanMoveState.backward = false; break;
            case 'KeyA': humanMoveState.left = false; break;
            case 'KeyD': humanMoveState.right = false; break;
        }
    };
    window.addEventListener('keyup', onKeyUpHuman);

    return {
        destroy: () => {
            renderer.domElement.removeEventListener('pointerdown', onMouseDown);
            window.removeEventListener('pointermove', onMouseMove);
            window.removeEventListener('pointerup', onMouseUp);
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('keydown', onKeyDownEditor);
            window.removeEventListener('mousemove', onMouseMoveHuman);
            window.removeEventListener('keydown', onKeyDownHuman);
            window.removeEventListener('keyup', onKeyUpHuman);
        }
    };
}
