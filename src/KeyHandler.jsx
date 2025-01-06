import { useEffect } from 'react'
import useGameState from './stores/gameState.js'

const KeyHandler = () => {
    const setKey = useGameState((state) => state.setKey)

    useEffect(() => {
        const handleKeyDown = (event) => {
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

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [setKey])

    return null
}

export default KeyHandler
