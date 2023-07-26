import { configureStore, Action, getDefaultMiddleware } from "@reduxjs/toolkit"
import dataReducer from "./dataSlice"
import createSagaMiddleware from "redux-saga"
import { watcherSaga } from "./sagas/rootSaga"

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: {
    data: dataReducer,
  },
  middleware: [...getDefaultMiddleware({ thunk: false }), sagaMiddleware],
})

sagaMiddleware.run(watcherSaga)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
