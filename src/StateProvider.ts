
export enum StateType {
    INITIAL = "INITIAL",
    MESSAGE = "MESSAGE",
    SHUTDOWN = "SHUTDOWN",
}

export type State = {
    type: StateType
    payload: string
    expires: number
}

export const InitialState: State = {
    type: StateType.INITIAL,
    payload: '',
    expires: 0
}

export class StateProvider {
    public state: State;

    private async commitState(newState: State) {
        this.state = newState
        return newState
    }

    public async init() {
        this.state = {
            ...InitialState
        }
        return true
    }

    public async getState() {
        return this.state
    }

    public async setState(newState: State) {
        const state = await this.getState()
        if (!state) {
            throw new Error('State is not properly initialized! Did you forget to call `init()` on the object?')
        }
        switch (state.type) {
            case StateType.SHUTDOWN:
                throw new Error('Cannot set state when server is already shutting down!')
            default: 
                return await this.commitState(newState)
        }
    }
}

