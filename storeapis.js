import {API_KEY,BASE_URL} from "@env"

/**
 * It takes a store as an argument, and returns a promise that resolves to the access token
 * @param {*} store changeFunc
 * @returns accessToken
 */
export const getToken = async (store,changeFunc) => {
    // check if access token is still valid,or else refresh the token
    let mainStore = store.getState();
    let {accessToken, refreshToken} = mainStore.user;
    let tokenation = await checkTokenExpired(accessToken);
    if (tokenation) {
        accessToken = await refreshTokenFunc(refreshToken);
        //reset the token in the store
        store.dispatch(changeFunc(accessToken))
    }

    return accessToken;
}

const refreshTokenFunc = async token => {
    const response = await fetch(`${BASE_URL}token/refresh/`,{
        method: 'POST',
        body:JSON.stringify({
            refresh: token,
        }),
        headers: {
            'content-type': 'application/json',
            "X-Api-Key": API_KEY,
        }
    })
    const result = await response.json();

    if (response.ok) {
        const {access} = result
        return access;
        
    }

    const {message} = result;
    throw new Error(message);
}

const checkTokenExpired = async token => {
    try{
        const response = await fetch(`${BASE_URL}check-token/`,{
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                "X-Api-Key": API_KEY,
                "Authorization":`Bearer ${token}`
            }
        })
        const result = await response.json();
        if (response.ok) {
            return false;
        }
        return true;
    }
    catch(err){
        console.log(err);
        return true;
    }
}