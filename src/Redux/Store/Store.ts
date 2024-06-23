import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; 
import userAuth from '../Slice/userSlice';
import adminSlice from '../Slice/adminSlice';
import recruiterSlice from '../Slice/recruiterSlice';
import jobSlice from '../Slice/jobSlice';
import { persistReducer, persistStore } from 'redux-persist';
  
  const persistConfig = {
    key: 'root',
    storage,
  };
  
  const rootReducer = combineReducers({
    user: userAuth,
    admin: adminSlice,
    recruiter: recruiterSlice,
    job:jobSlice
  });
  
  
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, 
      }),
  });
  
  export const persistor = persistStore(store);
  
  export default store;
  
  export type RootState = ReturnType<typeof store.getState>;