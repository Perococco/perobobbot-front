import axios, {AxiosResponse} from 'axios'
import { JWT_TOKEN_KEY } from './constants'
import { SecurityController } from './api/rest-controller'
import { JwtInfo } from './api/security-com'
import store, { Namespaces } from './store'
import { UserActions } from './store/modules/user/type'
import router from "./router";
import {Router} from "vue-router";
const securityController = new SecurityController()

function persistJwtToken(jwt: JwtInfo, rememberMe: boolean) {
    sessionStorage.setItem(JWT_TOKEN_KEY, jwt.token)

    if (rememberMe) {
        localStorage.setItem(JWT_TOKEN_KEY, jwt.token)
    } else {
        localStorage.removeItem(JWT_TOKEN_KEY)
    }
}

function setupAxiosHeader() {
    axios.interceptors.request.use((config) => {
        const token = sessionStorage.getItem(JWT_TOKEN_KEY)
        if (token !== undefined) {
            config.headers.Authorization = 'bearer ' + token
        }
        return config
    })
}

function setupAxios403(router:Router) {
    axios.interceptors.response.use(
        (resp) => resp,
        (error) => {
            if (rejectedOnFailedAuthentication(error.response)) {
                clearAllJwtTokens();
                router.push("/login")
            }
            return error;
        }
    )
}
function rejectedOnFailedAuthentication(response:AxiosResponse):boolean {
    return response.status == 403;
}


function initializeAuth(router:Router) {
    setupAxiosHeader()
    setupAxios403(router)
    copyLocalToSessionStorage()
}

function clearAllJwtTokens() {
    sessionStorage.removeItem(JWT_TOKEN_KEY)
    localStorage.removeItem(JWT_TOKEN_KEY)
}

async function retrieveCurrentUser(): Promise<boolean> {
    if (jwtIsPresentInSessionStorage()) {
        return securityController.getCurrentUser().then(
            async (user) => {
                await store.dispatch(
                    Namespaces.USER + '/' + UserActions.SET_USER,
                    user
                )
                return Promise.resolve(true)
            },
            async (reason) => {
                await store.dispatch(
                    Namespaces.USER + '/' + UserActions.CLEAR_AUTHENTICATION
                )
                clearAllJwtTokens()
                return Promise.resolve(false)
            }
        )
    }
    return Promise.resolve(false)
}

function jwtIsPresentInSessionStorage() {
    return sessionStorage.getItem(JWT_TOKEN_KEY) != null
}

function copyLocalToSessionStorage() {
    const localJwt = localStorage.getItem(JWT_TOKEN_KEY)
    const sessionJwt = sessionStorage.getItem(JWT_TOKEN_KEY)
    if (sessionJwt == null && localJwt != null) {
        sessionStorage.setItem(JWT_TOKEN_KEY, localJwt)
    }
}

export { initializeAuth, persistJwtToken, retrieveCurrentUser }
