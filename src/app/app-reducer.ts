import {Dispatch} from "redux";
import {authAPI} from "../api/todolists-api";
import {authLoginEnum, setIsLoggedInAC} from "../features/Login/auth-reducer";
import {handleServerAppError} from "../utils/error-utils";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}

type InitialStateType = typeof initialState


export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'SET-IS-INITIALIZED':
            return {...state, isInitialized: action.isInitialized}
        default:
            return state
    }
}

export const setAppStatusAC = (status: RequestStatusType) =>
    ({type: 'APP/SET-STATUS', status} as const)

export const setAppErrorAC = (error: string | null) =>
    ({type: 'APP/SET-ERROR', error} as const)

export const setIsInitializedAC = (isInitialized: boolean) =>
    ({type: 'SET-IS-INITIALIZED', isInitialized} as const)

export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me().then(res => {
        if (res.data.resultCode === authLoginEnum.OK) {
            dispatch(setIsLoggedInAC(true));
        } else {
            handleServerAppError(res.data, dispatch)
        }
    })
        .catch((rej) => {
            handleServerAppError(rej, dispatch)
        })
        .finally(() => {
            dispatch(setIsInitializedAC(true));
        })
}

export type setAppStatusACType = ReturnType<typeof setAppStatusAC>
export type setAppErrorACType = ReturnType<typeof setAppErrorAC>
export type setIsInitializedACType = ReturnType<typeof setIsInitializedAC>

type ActionsType = setAppStatusACType | setAppErrorACType | setIsInitializedACType
