import React from 'react'
import useGameState from './stores/gameState.js'

export default function HUD() {
    const ammo = useGameState((state) => state.ammo)

    const hudStyle = {
        position: 'absolute',
        top: '10px',
        left: '10px',
        color: 'white',
        fontSize: '20px',
        zIndex: 1000,
    }

    return (
        <div style={hudStyle}>
            <div>Speed: 100</div>
            <div>Health: 100%</div>
            <div>Ammo: {ammo}</div>
        </div>
    )
}
