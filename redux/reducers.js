import {combineReducers} from 'redux'
import {UPDATE_USER,
  LOG_IN_FULFILLED,
  UPDATE_CAROUSEL,
  LOG_IN_REJECTED,
  REGISTER_FULFILLED,
  REGISTER_REJECTED,
  UPDATE_ACCESS_TOKEN,
  OTP_CONFIRM_FULFILLED,
  OTP_REJECTED,
  OTP_RESEND,
  LOGOUT_USER,
  OTP_SUCCESS,
  RESET_PASSWORD_FULFILLED,
  RESET_PASSWORD_REJECTED,
  RESET_PASSWORD_SENT,
  OTP_FORGOT_CONFIRM_FULFILLED,
  CLEAR_MESSSAGES,
  GOOGLE_DETAILS

} from './actions'
import { getRandom } from '../helpfulFunc'
// import { REGISTER } from 'redux-persist'

const merge = (prev,next) => Object.assign({},prev,next)

const userReducer = (state = {}, action) => {
    switch (action.type){
      case UPDATE_USER:
          return merge(state, action.payload)
  
      case LOG_IN_FULFILLED:
        return merge(state,{...action.payload})

      case LOGOUT_USER:
        return merge(state,{accessToken:null,refreshToken:null,onboardDone:false,errMessage:`${getRandom()}.${action.payload}`,successMessage:null});
  
      case UPDATE_CAROUSEL:
        return merge(state,{carouselCheck:action.payload})    
    
      case LOG_IN_REJECTED:
          return merge(state,{errMessage:`${getRandom()}.${action.payload}`,successMessage:null})

      case REGISTER_FULFILLED:
        const {access,refresh} = action.payload;
        let accessToken = access;
        let refreshToken = refresh;
        const registerDone = true
        const onboardDone = false

        return merge(state,{accessToken,refreshToken,registerDone,onboardDone,errMessage:null,successMessage:`${getRandom()}.An otp has been sent to you`})

      case REGISTER_REJECTED:
        return merge(state,{errMessage:`${getRandom()}.${action.payload}`,successMessage:null})

      case UPDATE_ACCESS_TOKEN:
        return merge(state,{access_token:action.payload})

      case OTP_CONFIRM_FULFILLED:
        return merge(state,{onboardDone:true,errMessage:null,successMessage:`${getRandom()}.Otp verified sucessfully`})

      case OTP_FORGOT_CONFIRM_FULFILLED:
        return merge(state,{errMessage:null,successMessage:`${getRandom}.Otp verified sucessfully,you can change your password now`})

      case OTP_RESEND:
        let otpNum = state.otpNum || 0;
        otpNum += 1;
        return merge(state,{otpNum,successMessage:`${getRandom()}.${action.payload}`,errMessage:null})

      case OTP_SUCCESS:
        const {message,email} = action.payload;
        return merge(state,{otpNum,successMessage:`${getRandom()}.${message}`,errMessage:null,email,})

      case OTP_REJECTED:
        return merge(state,{errMessage:`${getRandom()}.${action.payload}`,successMessage:null})

      case RESET_PASSWORD_SENT:
        return merge(state,{errMessage:null,successMessage:null,passwordReset: false})
      
      case RESET_PASSWORD_FULFILLED:
        return merge(state,{errMessage:null,successMessage:`${getRandom()}.${action.payload}`,passwordReset:true})

      case RESET_PASSWORD_REJECTED:
        return merge(state,{errMessage:`${getRandom()}.${action.payload}`,successMessage:null,passwordReset:false})

      case CLEAR_MESSSAGES:
        return merge(state,{errMessage:null,successMessage:null})

      case GOOGLE_DETAILS:
        return merge(state,action.payload)
  
      default:
          return state
    } 
}

const reducers = combineReducers({
    user:userReducer
})


export default reducers