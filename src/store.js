import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import { configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import authSliceReducer from './slices/auth'
import recipeSliceReducer from './slices/recipes'
import recipePrivateSliceReducer from './slices/recipesPrivate'

const authPersist = persistReducer({
  key: 'auth',
  storage,
  blacklist: [''],
  whitelist: ['user', 'token']
},
authSliceReducer
)

export const store = configureStore({
  reducer: {
    recipes: recipeSliceReducer,
    recipesPrivate: recipePrivateSliceReducer,
    auth: authPersist
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
})

export const persistor = persistStore(store)
