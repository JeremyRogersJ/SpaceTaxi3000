import { useRapier, RigidBody } from '@react-three/rapier'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useKeyboardControls } from '@react-three/drei'
import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import useGameState from './stores/gameState.js'

function CityArea() {
    const starGeometry = new THREE.BufferGeometry()
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 })

    const starVertices = []
    for (let i = 0; i < 3000; i++) {
        const x = THREE.MathUtils.randFloatSpread(10)
        const y = THREE.MathUtils.randFloatSpread(10)
        const z = THREE.MathUtils.randFloatSpread(10)
        starVertices.push(x, y, z)
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3))

    return <points geometry={starGeometry} material={starMaterial} />
}

export default function Player() {
    const body = useRef()
    const [subscribeKeys, getKeys] = useKeyboardControls()
    const { rapier, world } = useRapier()
    const [smoothedCameraPosition] = useState(() => new THREE.Vector3(10, 10, 10))
    const [smoothedCameraTarget] = useState(() => new THREE.Vector3())
    const start = useGameState((state) => state.start)
    const end = useGameState((state) => state.end)
    const restart = useGameState((state) => state.restart)
    const blocksCount = useGameState((state) => state.blocksCount)
    const [projectiles, setProjectiles] = useState([])
    const ammo = useGameState((state) => state.ammo)
    const decrementAmmo = useGameState((state) => state.decrementAmmo)

    const Player = useGLTF('./LoaderRig.glb')

    useFrame((state, delta) => {
        const { forward, backward, leftward, rightward, Upward, downward, rightSpin, leftSpin } = getKeys()
        const impulseStrength = 100 * delta
        const rotationAngle = THREE.MathUtils.degToRad(5) // 5 degrees in radians

        if (forward) {
            body.current.applyImpulse({ x: 0, y: 0, z: -impulseStrength })
            body.current.rotation.y = 0 // Face forward
        }

        if (backward) {
            body.current.applyImpulse({ x: 0, y: 0, z: impulseStrength })
            body.current.rotation.y = Math.PI // Face backward
        }

        if (leftward) {
            body.current.applyImpulse({ x: -impulseStrength, y: 0, z: 0 })
            body.current.rotation.y = Math.PI / 2 // Face left
        }

        if (rightward) {
            body.current.applyImpulse({ x: impulseStrength, y: 0, z: 0 })
            body.current.rotation.y = -Math.PI / 2 // Face right
        }

        if (Upward) {
            body.current.applyImpulse({ x: 0, y: impulseStrength, z: 0 })
        }

        // Handle downward key for moving down
        if (downward) {
            body.current.applyImpulse({ x: 0, y: -impulseStrength, z: 0 })
        }

        // Handle right spin key
        if (rightSpin) {
            // body.current.rotation.y -= rotationAngle
        }

        // Handle left spin key
        if (leftSpin) {
            // body.current.rotation.y += rotationAngle
        }

        const bodyPosition = body.current.translation()

        // Smooth the camera movement
        const cameraPosition = new THREE.Vector3()
        cameraPosition.copy(bodyPosition)
        cameraPosition.z += 4 // Increase the offset to position the camera farther away
        cameraPosition.y += 1.5 // Adjust for a better view
        state.camera.position.lerp(cameraPosition, 0.1)
        state.camera.lookAt(bodyPosition)

        const cameraTarget = new THREE.Vector3();
        cameraTarget.copy(bodyPosition);

        smoothedCameraPosition.lerp(cameraPosition, 5 * delta);
        smoothedCameraTarget.lerp(cameraTarget, 5 * delta);

        state.camera.position.copy(smoothedCameraPosition);
        state.camera.lookAt(smoothedCameraTarget);

        // Update projectiles
        setProjectiles((prev) =>
            prev.map((proj) => ({
                ...proj,
                position: proj.position.clone().add(proj.velocity.clone().multiplyScalar(delta)),
            }))
        )

        /**
        * Phases
        */
        if (bodyPosition.z < -(blocksCount * 4 + 2))
            end()

        if (bodyPosition.y < -4)
            restart()
    })

    // Create a box geometry for the LoaderRig collider
    const boxGeometry = new THREE.BoxGeometry(1, 0.6, 1)

    return (
        <>
            <RigidBody
                ref={body}
                canSleep={false}
                restitution={-5.5}
                friction={15} // Adjusted friction
                linearDamping={5} // Increased linear damping
                angularDamping={5} // Increased angular damping
                position={[0, 1, 0]}
                gravityScale={0} // Disable gravity
                lockRotations={true} // Allow rotations
            >
                <primitive object={Player.scene} scale={.5} position={[0, 0, 0]} rotation={[0, 270 * (Math.PI / 180), 0]} />
                {/* Add a larger bounding box for the LoaderRig */}
                <mesh>
                    <boxGeometry args={[1, .5, 1]} />
                    <meshBasicMaterial color="#e31111" opacity={0} wireframe={true} /> 
                </mesh>
                {/* Add four more bounding boxes on top of the platform, oriented like a fence */}
                <mesh position={[0, 0.5, 0.5]}>
                    <boxGeometry args={[1, 0.1, 0.1]} />
                    <meshBasicMaterial color="#e31111" opacity={0} wireframe={true} />
                </mesh>
                <mesh position={[0, 0.5, -0.5]}>
                    <boxGeometry args={[1, 0.1, 0.1]} />
                    <meshBasicMaterial color="#e31111" opacity={0} wireframe={true} />
                </mesh>
                <mesh position={[0.5, 0.5, 0]}>
                    <boxGeometry args={[0.1, 0.1, 1]} />
                    <meshBasicMaterial color="#e31111" opacity={0} wireframe={true} />
                </mesh>
                <mesh position={[-0.5, 0.5, 0]}>
                    <boxGeometry args={[0.1, 0.1, 1]} />
                    <meshBasicMaterial color="#e31111" opacity={0} wireframe={true} />
                </mesh>
            </RigidBody>
            {projectiles.map((proj, index) => (
                <mesh key={index} position={proj.position}>
                    <sphereGeometry args={[0.1, 16, 16]} />
                    <meshBasicMaterial color="yellow" />
                </mesh>
            ))}
        </>
    )
}

// Ensure the star field is rendered only once
function Scene() {
    return (
        <>
            <CityArea />
            <Player />
        </>
    )
}