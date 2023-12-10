export const SET_LOADING_REDUCER = 'SET_LOADING_REDUCER';
export const SET_LOADING_AUTH_REDUCER = 'SET_LOADING_AUTH_REDUCER';
export const SET_ERROR_REDUCER: string = 'SET_ERROR_REDUCER';
export const SET_SUCCESS_REDUCER: string = 'SET_SUCCESS_REDUCER';

export const setLoading = (isLoading: boolean) => {
  return {
    type: SET_LOADING_REDUCER,
    isLoading
  }
}

export const setLoadingAuth = (isLoading: boolean) => {
  return {
    type: SET_LOADING_AUTH_REDUCER,
    isLoading
  }
}

export const setSuccessMess = (mess: string) => {
  return {
    type: SET_SUCCESS_REDUCER,
    success: mess
  }
}

export const setErrorMess = (e: any) => {
  return {
    type: SET_ERROR_REDUCER,
    error: e?.detail || e?.message || e?.error || e || "Unknown error"
  }
}

export const clearErrorMess = (e: any) => {
  return {
    type: SET_ERROR_REDUCER,
    error: undefined
  }
}