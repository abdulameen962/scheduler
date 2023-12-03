import { login,register,confirmOtp,resendOtp,resetPassword,confirmPasswordOtp,changeNewPassword } from '../api';
import { getToken } from '../storeapis';
import { getRandom } from '../helpfulFunc';

// action types
export const UPDATE_USER = 'UPDATE_USER'
export const UPDATE_CAROUSEL = 'UPDATE_CAROUSEL'
export const LOG_IN_SENT = "LOG_IN_SENT"
export const LOG_IN_FULFILLED = "LOG_IN_FULFILLED"
export const LOG_IN_REJECTED = "LOG_IN_REJECTED"
export const REGISTER_SENT = "REGISTER_SENT"
export const REGISTER_FULFILLED = "REGISTER_FULFILLED"
export const REGISTER_REJECTED = "REGISTER_REJECTED"
export const UPDATE_ACCESS_TOKEN = "UPDATE_ACCESS_TOKEN"
export const OTP_CONFIRM_SENT = "OTP_CONFIRM_SENT"
export const OTP_CONFIRM_FULFILLED = "OTP_CONFIRM_FULFILLED"
export const OTP_REJECTED = "OTP_REJECTED"
export const OTP_RESEND = "OTP_RESEND"
export const LOGOUT_USER = "LOGOUT_USER"
export const OTP_SUCCESS = "OTP_SUCCESS"
export const RESET_PASSWORD_SENT = "RESET_PASSWORD_SENT"
export const RESET_PASSWORD_FULFILLED = "RESET_PASSWORD_FULFILLED"
export const RESET_PASSWORD_REJECTED = "RESET_PASSWORD_REJECTED"
export const OTP_FORGOT_CONFIRM_SENT = "OTP FORGOT CONFIRM SENT"
export const OTP_FORGOT_CONFIRM_FULFILLED = "OTP FORGOT CONFIRM FULFILLED"
export const CLEAR_MESSSAGES = "CLEAR_MESSSAGES"
export const GOOGLE_DETAILS = "GOOGLE_DETAILS"

// action creators
export const updateUser = update => ({
    type: UPDATE_USER,
    payload: update,
})

export const updateCarousel = update => ({
    type: UPDATE_CAROUSEL,
    payload:update
})

//asynchronous action creator
export const loginUser = (username,password,loginFn=login) => async dispatch => {
    dispatch({type:LOG_IN_SENT,payload:""})
    try{
        const token = await loginFn(username,password)
        const {access_token,refresh_token} = token;
        let accessToken = access_token;
        let refreshToken = refresh_token;
        const onboardDone = true;
        const registerDone = true;
        const successMessage = "Logged in sucessfully"
        const payload = {accessToken,refreshToken,registerDone,onboardDone,errMessage:null,successMessage}
        dispatch({type:LOG_IN_FULFILLED,payload})
    }
    catch (error)
    {
        dispatch({type:LOG_IN_REJECTED,payload:error.message})
    }
  
    // return 
}

export const registerUser = (username,email,password1,password2,registerFn=register) => async dispatch => {
    dispatch({type:REGISTER_SENT,payload:""})
    try {
        const info = await registerFn(username,email,password1,password2)
        dispatch({type:REGISTER_FULFILLED,payload:info})
    }
    catch (error)
    {
        dispatch({type:REGISTER_REJECTED,payload:error.message})
    }
}

export const confirmRegisterOtp = (store,otp,otpFunc=confirmOtp) => async dispatch => {
    dispatch({type:OTP_CONFIRM_SENT,payload:""})
    try{
        const authCode = await getToken(store,resetAcessToken,logoutUser);
        await otpFunc(otp,authCode);
        dispatch({type:OTP_CONFIRM_FULFILLED,payload:""})
    }
    catch(error){
        // const {messages} = error.message[0];
        // const {message} = messages;
        dispatch({type:OTP_REJECTED,payload:error.message})
    }
}

export const resendOtpVerification = (store,resendFunc=resendOtp) => async dispatch => {
    dispatch({type:OTP_CONFIRM_SENT,payload:""})
    try{
        const authCode = await getToken(store,resetAcessToken,logoutUser);
        await resendFunc(authCode);
        dispatch({type:OTP_RESEND,payload:"Otp resent sucessfully,enter the otp sent to your mail"})
    }
    catch(error){
        // const {messages} = error.message[0];
        // const {message} = messages;
        dispatch({type:OTP_REJECTED,payload:error.message})
    }
}

export const sendForgotPasswordOtp = (email,store=null,forgotFunc=resetPassword) => async dispatch => {
    if (!email && store) {
        email = store.getState().user.email;
    }
    dispatch({type:OTP_CONFIRM_SENT,payload:""})
    try{
        await forgotFunc(email);
        dispatch({type:OTP_SUCCESS,payload:{message:"Otp resent sucessfully,enter the otp sent to your mail",email,}});
        return true;
    }
    catch(error){
        dispatch({type:OTP_REJECTED,payload:error.message});
        return false;
    }
}

export const confirmForgotPasswordOtp = (otp,confirmFunc=confirmPasswordOtp) => async dispatch => {
    dispatch({type:OTP_FORGOT_CONFIRM_SENT,payload:""})
    try{
        await confirmFunc(otp);
        dispatch({type:OTP_FORGOT_CONFIRM_FULFILLED,payload:""})

        return true;
    }
    catch(error){
        dispatch({type:OTP_REJECTED,payload:error.message})
        return false;
    }
}

export const changePassword = (store,password,changeFunc=changeNewPassword) => async dispatch => {
    // get the email from the store
    const {email} = store.getState().user;
    dispatch({type:RESET_PASSWORD_SENT,payload:""})
    try{
        await changeFunc(password,email);
        dispatch({type:RESET_PASSWORD_FULFILLED,payload:"Password changed sucessfully,you can proceed to login"});
        return true;
    }
    catch(error){
        dispatch({type:RESET_PASSWORD_REJECTED,payload:error.message})
        return false;
    }
}

export const logUserOut = () => dispatch => {
    dispatch({
        type: LOGOUT_USER,
        payload: {successMessage:`${getRandom()}.${"Logout sucessful"}`,errMessage:null},
    })
}


/**
 * To change the access token in the global state
 * just pass the string token
 * @param {string} token
 */
export const resetAcessToken = token => ({
    type: UPDATE_ACCESS_TOKEN,
    payload: token,
})


export const logoutUser = message => ({
    type: LOGOUT_USER,
    payload: {errMessage:`${getRandom()}.${message}`,successMessage:null},
})

export const clearMessages = () => ({
    type: CLEAR_MESSSAGES,
    payload: null
})

export const googleDetails = message => ({
    type: GOOGLE_DETAILS,
    payload: message
})