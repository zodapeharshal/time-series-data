import { configureStore } from '@reduxjs/toolkit'
import companyReducer from './reducers/companySlice'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, companyReducer)

export const store = configureStore({
  reducer: {
    companyDet : persistedReducer,
    middleware: [thunk]
  },
})

export const persistor = persistStore(store) ;