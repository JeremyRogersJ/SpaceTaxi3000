import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import { KeyboardControls } from '@react-three/drei'
import Interface from './Interface.jsx'
import HUD from './HUD.jsx'
import useGameState from './stores/gameState.js'

const root = ReactDOM.createRoot(document.querySelector('#root'))

const handleKeyDown = (event) => {
    const { setKey } = useGameState.getState()
    const keyMap = {
        'KeyW': 'forward',
        'KeyS': 'backward',
        'KeyA': 'leftward',
        'KeyD': 'rightward',
        'ArrowUp': 'Upward',
        'ArrowDown': 'downward',
        'ArrowRight': 'rightSpin',
        'ArrowLeft': 'leftSpin',
    }
    if (keyMap[event.code]) {
        setKey(keyMap[event.code], true)
    }
}

const handleKeyUp = (event) => {
    const { setKey } = useGameState.getState()
    const keyMap = {
        'KeyW': 'forward',
        'KeyS': 'backward',
        'KeyA': 'leftward',
        'KeyD': 'rightward',
        'ArrowUp': 'Upward',
        'ArrowDown': 'downward',
        'ArrowRight': 'rightSpin',
        'ArrowLeft': 'leftSpin',
    }
    if (keyMap[event.code]) {
        setKey(keyMap[event.code], false)
    }
}

window.addEventListener('keydown', handleKeyDown)
window.addEventListener('keyup', handleKeyUp)

root.render(
    <KeyboardControls
        map={ [
            { name: 'forward', keys: [ 'KeyW' ] },
            { name: 'backward', keys: [ 'KeyS' ] },
            { name: 'leftward', keys: [ 'KeyA' ] },
            { name: 'rightward', keys: [ 'KeyD' ] },
            { name: 'Upward', keys: [ 'ArrowUp' ] },
            { name: 'downward', keys: [ 'ArrowDown' ] },
            { name: 'rightSpin', keys: [ 'ArrowRight' ] },
            { name: 'leftSpin', keys: [ 'ArrowLeft' ] },
        ] }
    >
        <Canvas
            shadows
            camera={ {
                fov: 75,
                near: 0.1,
                far: 200,
                position: [ 2.5, 15, 6 ]
            } }
        >
            <Experience />
        </Canvas>
        <Interface />
        <HUD />
    </KeyboardControls>
)