import { useEffect } from 'react'
import useGameState from '../stores/gameState'

const keyMap = {
    KeyW: 'forward',
    KeyS: 'backward',
    KeyA: 'leftward',
    KeyD: 'rightward',
    Space: 'Upward',
    ShiftLeft: 'downward', // Map ShiftLeft to downward
}

export default function useKeyboardControls() {
    const setKeys = useGameState((state) => state.setKeys)

    useEffect(() => {
        const handleKeyDown = (event) => {
            const key = keyMap[event.code]
            if (key) {
                setKeys((keys) => ({ ...keys, [key]: true }))
            }
        }

        const handleKeyUp = (event) => {
            const key = keyMap[event.code]
            if (key) {
                setKeys((keys) => ({ ...keys, [key]: false }))
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [setKeys])

    return useGameState((state) => state.keys)
}
