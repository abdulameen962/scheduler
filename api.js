import {API_KEY,BASE_URL} from "@env"
// import { getToken } from "./storeapis";

export const login = async (username,password) => {
    const response = await fetch(`${BASE_URL}users/login/`,{
        method: 'POST',
        body:JSON.stringify({
            username,password
        }),
        headers: {
            'content-type': 'application/json',
            "X-Api-Key": API_KEY,
        }
    })
    const result = await response.json();
    if (response.ok) {
        const {data} = result;
        return data;
        
    }

    const {message} = result;
    throw new Error(message);
}

export const register = async (username,email,password1,password2) => {
    const response = await fetch(`${BASE_URL}users/registration/`,{
        method: 'POST',
        body:JSON.stringify({
            username,
            email,
            password1,
            password2
        }),
        headers: {
            'content-type': 'application/json',
            "X-Api-Key": API_KEY,
            // "Authorization":""
        }
    })
    const result = await response.json();
    if (response.ok) {
        const {access,refresh} = result;
        accessTokenName = access;
        refreshTokenName = refresh;
        return result;
        
    }

    let message = '';
    const valueErrors = Object.values(result);
    for (let i = 0; i < valueErrors.length; i++) {
        const element = valueErrors[i];
        for (let i = 0; i < element.length; i++) {
            const error = element[i];
            message = `${message} ${error}`;
        }
        
    }
    // let emailErr = result.email !== undefined ? result.email[0] :"";
    // let password1Err = result.password1 !== undefined ? result.password1[0]:"";
    // let password2Err = result.password2 !== undefined ?result.password2[0] :"";
    // let message = `${emailErr} ${password1Err} ${password2Err}`;
    if (message.length < 10) {
        message = "Something went wrong,check your inputs and try again";
    }
    throw new Error(message);
}

export const resetPassword = async email => {
    const response = await fetch(`${BASE_URL}users/password/reset/`,{
        method: 'POST',
        body:JSON.stringify({
            email:email,
        }),
        headers: {
            'content-type': 'application/json',
            "X-Api-Key": API_KEY,
            "Authorization":`Bearer ${await getToken()}`
        }
    })
    const result = await response.json();
    if (response.ok) {
        return result;
        
    }

    const {message} = result;
    throw new Error(message);
}

export const confirmOtp = async (otp,authCode) => {
    const response = await fetch(`${BASE_URL}generate-registration-otp/`,{
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            "X-Api-Key": API_KEY,
            "Authorization":`Bearer ${authCode}`
        },

        body:JSON.stringify({otp})
    })
    const result = await response.json();
    if (response.ok) {
        return result;
    }

    const {message} = result;
    throw new Error(message);

}

export const resendOtp = async authCode => {
    const response = await fetch(`${BASE_URL}generate-registration-otp/`,{
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            "X-Api-Key": API_KEY,
            "Authorization":`Bearer ${authCode}`
        },

    })
    const result = await response.json();
    if (response.ok) {
        return true;
    }

    const {message} = result;
    throw new Error(message);
}
