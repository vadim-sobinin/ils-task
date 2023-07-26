import { takeLatest } from "redux-saga/effects"
import { getAPIRoute } from "../dataSlice"
import { handleGetRoute } from "./handlers/route"

export function* watcherSaga() {
  // @ts-ignore
  yield takeLatest(getAPIRoute.type, handleGetRoute)
}
