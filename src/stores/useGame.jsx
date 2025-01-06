import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

const useGameState = create(subscribeWithSelector((set) => ({
    blocksCount: 10,
    blocksSeed: 0,
    ammo: 50,
    decrementAmmo: () => set((state) => ({ ammo: state.ammo - 1 })),
    
    /**
     * Time
     */
    startTime: 0,
    endTime: 0,

    /**
     * Phases
     */
    phase: 'ready',

    start: () => {
        set((state) => {
            if (state.phase === 'ready')
                return { phase: 'playing', startTime: Date.now() }

            return {}
        })
    },

    restart: () => {
        set((state) => {
            if (state.phase === 'playing' || state.phase === 'ended')
                return { phase: 'ready', blocksSeed: Math.random() }

            return {}
        })
    },

    end: () => {
        set((state) => {
            if (state.phase === 'playing')
                return { phase: 'ended', endTime: Date.now() }

            return {}
        })
    }
})))

export default useGameState