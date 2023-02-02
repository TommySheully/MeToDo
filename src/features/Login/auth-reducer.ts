import {Dispatch} from 'redux'
import {
    setAppErrorACType,
    setAppStatusAC,
    setAppStatusACType,
    setIsInitializedAC,
    setIsInitializedACType
} from '../../app/app-reducer'
import {authAPI, loginAuthType} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import axios from 'axios';
import {clearDataAC, clearDataACType} from "../TodolistsList/todolists-reducer";

const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState


export enum authLoginEnum {
    OK = 0
}
export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}
// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// thunks
export const loginTC = (loginAuth: loginAuthType) => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))

    try {
        const res = await authAPI.login(loginAuth)

        if (res.data.resultCode === authLoginEnum.OK) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (rej) {
        {axios.isAxiosError(rej) && handleServerNetworkError(rej, dispatch)}
        // if (axios.isAxiosError(rej)) проверка нашего rej на наличие, если он true, тогда выполни handleServerNetworkError
    }


/*    dispatch(setAppStatusAC('loading'))
    authAPI.login(loginAuth)
        .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(setIsLoggedInAC(true))
                    dispatch(setAppStatusAC('succeeded'))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            }
        )
        .catch((rej) => {
            handleServerNetworkError(rej, dispatch)
        })*/
}

export const logoutTC = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(false))
                dispatch(clearDataAC())
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}


// types
type ActionsType = ReturnType<typeof setIsLoggedInAC> | setAppStatusACType | setAppErrorACType | setIsInitializedACType | clearDataACType
