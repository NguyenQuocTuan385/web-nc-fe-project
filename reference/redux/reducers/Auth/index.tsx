import produce from 'immer';


export interface AuthState {
}

const initial: AuthState = {
}

export const authReducer = (state = initial, action: any) =>
  produce(state, draft => {
    switch (action.type) {
      default:
        return state;
    }
  })
