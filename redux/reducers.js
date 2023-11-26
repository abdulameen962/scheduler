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
  OTP_RESEND

} from './actions'
// import { REGISTER } from 'redux-persist'

const merge = (prev,next) => Object.assign({},prev,next)

const userReducer = (state = {}, action) => {
    switch (action.type){
      case UPDATE_USER:
          return merge(state, action.payload)
  
      case LOG_IN_FULFILLED:
        return merge(state,{...action.payload})
  
      case UPDATE_CAROUSEL:
        return merge(state,{carouselCheck:action.payload})    
    
      case LOG_IN_REJECTED:
          return merge(state,{...action.payload})

      case REGISTER_FULFILLED:
        const {access,refresh} = action.payload;
        let accessToken = access;
        let refreshToken = refresh;
        const registerDone = true
        const onboardDone = false

        return merge(state,{accessToken,refreshToken,registerDone,onboardDone,errMessage:null,successMessage:"An otp has been sent to you"})

      case REGISTER_REJECTED:
        return merge(state,{errMessage:action.payload})

      case UPDATE_ACCESS_TOKEN:
        return merge(state,{access_token:action.payload})

      case OTP_CONFIRM_FULFILLED:
        return merge(state,{onboardDone:true,errMessage:null,successMessage:"Otp verified sucessfully"})

      case OTP_RESEND:
        let otpNum = state.otpNum || 0;
        otpNum += 1;
        return merge(state,{otpNum,successMessage:action.payload,errMessage:null})

      case OTP_REJECTED:
        return merge(state,{errMessage:action.payload,successMessage:null})
  
      default:
          return state
    } 
}

const reducers = combineReducers({
    user:userReducer
})


export default reducers