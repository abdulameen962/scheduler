import { login,
    register,
    confirmOtp,
    resendOtp,
    resetPassword,
    confirmPasswordOtp,
    changeNewPassword,
    googleEntry,
    getGoals,
    getProfile,
    logoutApi,
    getOngoingTasks,
    predictWord,
    getCurrentNotifications
} from '../api';
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
export const SET_NOTIFICATION_TOKEN = "SET_NOTIFICATION_TOKEN"
export const USER_DETAILS = "USER_DETAILS"
export const NOT_EMAIL_VERIFIED = "NOT EMAIL VERIFIED"

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
        const result = await loginFn(username,password);
        const {message} = result;
        if (message == 'user not email verified') {
            const {email} = result;
            dispatch({type:NOT_EMAIL_VERIFIED,payload:{email,message:"Your email isn't verified,pls click to resend"}})
        }
        else{
            const {data} = result;
            const {access_token,refresh_token} = data;
            let accessToken = access_token;
            let refreshToken = refresh_token;
            const onboardDone = true;
            const registerDone = true;
            const successMessage = "Logged in sucessfully"
            const payload = {accessToken,refreshToken,registerDone,onboardDone,errMessage:null,successMessage}
            dispatch({type:LOG_IN_FULFILLED,payload})
    
            // // get profile here
            getImmediateProfile(access_token,dispatch);
        }
    }
    catch (error)
    {
        dispatch({type:LOG_IN_REJECTED,payload:error.message})
    }
  
    // return 
}

export const googleApi = (token,googleFunc=googleEntry) => async dispatch => {
    dispatch({type:LOG_IN_SENT,payload:""})
    try{
        const response = await googleFunc(token);
        const {access_token,refresh_token} = response;
        let accessToken = access_token;
        let refreshToken = refresh_token;
        const onboardDone = true;
        const registerDone = true;
        const successMessage = "Logged in sucessfully"
        const payload = {accessToken,refreshToken,registerDone,onboardDone,errMessage:null,successMessage}
        dispatch({type:LOG_IN_FULFILLED,payload})

        // // get profile here
        getImmediateProfile(access_token,dispatch);
        return true;
    }
    catch(error){
        dispatch({type:LOG_IN_REJECTED,payload:error.message})

        return false;
    }
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

        // get profile here
        return getImmediateProfile(false,dispatch,store);
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

const getImmediateProfile = async (authName=false,dispatch,store=null,profileFunc=getProfile) => {
    try{
        let authCode;
        if (authName) {
            authCode = authName;
        }
        else{
            authCode = await getToken(store,resetAcessToken,logoutUser);
        }
        const result = await profileFunc(authCode);
        const {email,first_name,last_name,username} = result;
        const data = {email,first_name,last_name,username}

        dispatch({type:USER_DETAILS,payload:data});
        return;
    }
    catch(error){
        console.log(error.message)
        // const {messages} = error.message[0];
        // const {message} = messages;
        dispatch({type:OTP_REJECTED,payload:error.message});
        return;
    }
}

export const userProfile = (store,profileFunc=getProfile) => async dispatch =>  {
    // dispatch({type:OTP_CONFIRM_SENT,payload:""})
    const mainStore = store.getState();
    const {profile} = mainStore.userProfile;
    if (profile) {
        return profile;
    }

    return await getImmediateProfile(false,dispatch,store,profileFunc);
}

export const userGoals = async (store,goalFunc=getGoals) => {
    // dispatch({type:OTP_CONFIRM_SENT,payload:""})
    try{
        const authCode = await getToken(store,resetAcessToken,logoutUser);
        const result = await goalFunc(authCode,false,3);

        // console.log(result);

        return result;
        // dispatch({type:OTP_RESEND,payload:"Otp resent sucessfully,enter the otp sent to your mail"})
    }
    catch(error){
        console.log(error.message)
        // dispatch({type:OTP_REJECTED,payload:error.message})
    }
}

export const onGoingTasks = async (store,goalFunc=getOngoingTasks) => {
    try{
        const authCode = await getToken(store,resetAcessToken,logoutUser);
        const result = await goalFunc(authCode,"ongoing",8);

        return result;
    }
    catch(error){
        console.log(error.message)
    }
}

export const wordPredict = async (store,sentence,word=null,predictor=predictWord) => {
    try{
        const authCode = await getToken(store,resetAcessToken,logoutUser);
        const result = word !== null? await predictor(authCode,sentence,word) : await predictor(authCode,sentence);

        return result;
    }
    catch(error){
        console.log(error.message)
    }
}

export const getNotifications = async (store,notifyFunc=getCurrentNotifications) => {
    try{
        const authCode = await getToken(store,resetAcessToken,logoutUser);
        const result = await notifyFunc(authCode);

        return result;
    }
    catch(error){
        console.log(error.message)
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

export const logUserOut = (store,logFunc=logoutApi) => async dispatch => {
    try{
        const authCode = await getToken(store,resetAcessToken,logoutUser);
        const result = await logFunc(authCode);
        if (result) dispatch({
            type: LOGOUT_USER,
            payload: {successMessage:`${getRandom()}.${"Logout sucessful"}`,errMessage:null},
        })
    }
    catch(error){
        // const {messages} = error.message[0];
        // const {message} = messages;
        dispatch({type:OTP_REJECTED,payload:error.message})
    }
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

export const setNotificationToken = token => ({
    type: SET_NOTIFICATION_TOKEN,
    payload:token
})