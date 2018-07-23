import { StateProvider, InitialState, State, StateType } from '~/StateProvider'

describe('StateProvider', () => {
    it('correctly initializes the INITIAL state', async () => {
        const provider = new StateProvider()
        
        const initSpy = jest.spyOn(provider, 'init')
        const setStateSpy = jest.spyOn(provider, 'setState')
        const commitSpy = jest.spyOn(provider, 'commitState' as any)

        const initialized = await provider.init()

        expect(initialized).toBe(true)
        await expect(provider.getState()).resolves.toEqual(InitialState)
        expect(initSpy).toHaveBeenCalledTimes(1)
        expect(setStateSpy).toHaveBeenCalledTimes(0)
        expect(commitSpy).toHaveBeenCalledTimes(0)
    })
    it('correctly sets the next MESSAGE state', async () => {
        const NEXT_STATE: State = {
            type: StateType.MESSAGE,
            payload: '',
            expires: 0,
        }
        const provider = new StateProvider()
        
        const initSpy = jest.spyOn(provider, 'init')
        const setStateSpy = jest.spyOn(provider, 'setState')
        const commitSpy = jest.spyOn(provider, 'commitState' as any)

        await provider.init()
        const newState = await provider.setState(NEXT_STATE)

        expect(newState).toEqual(NEXT_STATE)
        expect(initSpy).toHaveBeenCalledTimes(1)
        expect(setStateSpy).toHaveBeenCalledTimes(1)
        expect(commitSpy).toHaveBeenCalledTimes(1)
    })
    it('throws when trying to set state before initializing', async () => {
        const NEXT_STATE: State = {
            type: StateType.MESSAGE,
            payload: '',
            expires: 0,
        }

        const provider = new StateProvider()

        const initSpy = jest.spyOn(provider, 'init')
        const setStateSpy = jest.spyOn(provider, 'setState')
        const commitSpy = jest.spyOn(provider, 'commitState' as any)

        expect(provider.setState(NEXT_STATE)).rejects.toThrow(Error)
        expect(initSpy).toHaveBeenCalledTimes(0)
        expect(setStateSpy).toHaveBeenCalledTimes(1)
        expect(commitSpy).toHaveBeenCalledTimes(0)
    })
    it('throws when trying to set state when in SHUTDOWN state', async () => {
        const NEXT_STATE: State = {
            type: StateType.SHUTDOWN,
            payload: '',
            expires: 0,
        }
        const provider = new StateProvider()

        const initSpy = jest.spyOn(provider, 'init')
        const setStateSpy = jest.spyOn(provider, 'setState')
        const commitSpy = jest.spyOn(provider, 'commitState' as any)

        await Promise.all([provider.init(), provider.setState(NEXT_STATE)])

        expect(provider.setState(NEXT_STATE)).rejects.toThrow(Error)
        expect(initSpy).toHaveBeenCalledTimes(1)
        expect(setStateSpy).toHaveBeenCalledTimes(2)
        expect(commitSpy).toHaveBeenCalledTimes(1)
    })
})