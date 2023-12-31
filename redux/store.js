// import {createStore,applyMiddleware} from 'redux'
import { resetAcessToken } from "./actions";
import { configureStore } from '@reduxjs/toolkit'
import reducer from './reducers'
import {persistStore,persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import thunk from 'redux-thunk'
import { PURGE } from 'redux-persist';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['user','userProfile'],
    blacklist: []
}

const persistedReducer = persistReducer(persistConfig,reducer)
export const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk],
  });

export const persistor = persistStore(store)

const purgeState = () => {
    store.dispatch({ 
        type: PURGE,
        key: "root",    // Whatever you chose for the "key" value when initialising redux-persist in the **persistCombineReducers** method - e.g. "root"
       result: () => null              // Func expected on the submitted action. 
    });   
}

// purgeState();