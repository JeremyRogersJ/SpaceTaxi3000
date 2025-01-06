import React from 'react'
import { RigidBody } from '@react-three/rapier'

const BoxItem = () => {
    return (
        <RigidBody
            canSleep={false}
            restitution={0.0}
            friction={100}
            linearDamping={0.5}
            angularDamping={0.5}
            position={[0, 3, 0]}
            mass={150}
            gravityScale={2} // Enable gravity
        >
            <mesh>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshBasicMaterial color="#ff8400" />
            </mesh>
        </RigidBody>
    )
}

export default BoxItem