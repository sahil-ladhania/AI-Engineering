import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// Add slice reducers here as the app grows
const rootReducer = combineReducers({
  // e.g. chat: chatReducer,
})

const persistConfig = {
  key: 'synapse',
  version: 1,
  storage,
  // whitelist: ['chat'],  ← opt-in persistence per slice
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Required: ignore redux-persist internal actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

// Infer types from the un-persisted rootReducer so RootState stays clean
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
