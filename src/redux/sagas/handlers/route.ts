import { call, put } from "redux-saga/effects"
import { setAPIRoute, setFetchFailure } from "../../dataSlice"
import { getRouteFromAPI } from "../../../servises/osrm"
import { LatLngTuple } from "leaflet"

export function* handleGetRoute({
  payload,
}: {
  payload: LatLngTuple[][]
}): any {
  try {
    const response1 = yield call(getRouteFromAPI, payload[0])
    const response2 = yield call(getRouteFromAPI, payload[1])

    yield put(setAPIRoute([response1, response2]))
  } catch (error: any) {
    yield put(setFetchFailure())
    console.log("Fetch error ", error.message)
  }
}
