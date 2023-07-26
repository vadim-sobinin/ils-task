import {
  createAsyncThunk,
  createSlice,
  current,
  PayloadAction,
} from "@reduxjs/toolkit"
import { RootState } from "./store"
import { DataType } from "../components/table/TableComponent"
import { Key } from "react"
import { LatLngTuple } from "leaflet"

export interface DataState {
  dataSource: DataType[]
  selectedRowKeys: Key[]
  status: "idle" | "loading" | "failed"
  selectedRoute: DataType | null
  routeCoords: LatLngTuple[][]
}

const initialState: DataState = {
  dataSource: [
    {
      key: "0",
      route: "Маршрут №1",
      point1: [59.8382605045259, 30.30664443969727],
      point2: [59.82934196, 30.42423701],
      point3: [59.83567701, 30.38064206],
    },
    {
      key: "1",
      route: "Маршрут №2",
      point1: [59.82934196, 30.42423701],
      point2: [59.82761295, 30.41705607],
      point3: [59.84660399, 30.29496392],
    },
    {
      key: "2",
      route: "Маршрут №3",
      point1: [59.83567701, 30.38064206],
      point2: [59.84660399, 30.84660399],
      point3: [59.82761295, 30.41705607],
    },
  ],
  selectedRowKeys: [],
  status: "idle",
  selectedRoute: null,
  routeCoords: [],
}

// export const incrementAsync = createAsyncThunk(
//   "counter/fetchCount",
//   async (amount: number) => {
//     const response = await fetchCount(amount)
//     // The value we return becomes the `fulfilled` action payload
//     return response.data
//   },
// )

export const dataSlice = createSlice({
  name: "data",
  initialState,

  reducers: {
    deleteRoute: (state, { payload }: PayloadAction<Key>) => {
      state.dataSource = state.dataSource.filter((item) => item.key !== payload)
    },
    addRoute: (state, { payload }: PayloadAction<number>) => {
      const newData: DataType = {
        key: String(payload),
        route: `Маршрут №${payload + 1}`,
        point1: [0, 0],
        point2: [0, 0],
        point3: [0, 0],
      }
      state.dataSource = [...state.dataSource, newData]
    },
    saveRoute: (state, { payload }: PayloadAction<DataType>) => {
      const newData = [...state.dataSource]
      const index = newData.findIndex((item) => payload.key === item.key)
      const item = newData[index]
      newData.splice(index, 1, {
        ...item,
        ...payload,
      })
      state.dataSource = newData
    },
    setSelectedRowKeys: (state, { payload }: PayloadAction<Key[]>) => {
      state.selectedRowKeys = payload
      const selectedRoute = state.dataSource.find(
        (route) => route.key === payload[0],
      )
      state.selectedRoute = selectedRoute || null
    },
    updateCoords: (
      state,
      {
        payload: { key, point, coords },
      }: PayloadAction<{
        key: Key
        point: "point1" | "point2" | "point3"
        coords: LatLngTuple
      }>,
    ) => {
      state.dataSource[state.dataSource.findIndex((elem) => elem.key === key)][
        point
      ] = coords

      if (state.selectedRowKeys[0] === key && state.selectedRoute !== null) {
        state.selectedRoute[point] = coords
      }
    },
    getAPIRoute(state) {
      state.status = "loading"
    },
    setAPIRoute(state, { payload }: PayloadAction<LatLngTuple[][]>) {
      state.routeCoords = payload
      state.status = "idle"
    },
  },

  // extraReducers: (builder) => {
  //   builder
  //     .addCase(incrementAsync.pending, (state) => {
  //       state.status = "loading"
  //     })
  //     .addCase(incrementAsync.fulfilled, (state, action) => {
  //       state.status = "idle"
  //       state.value += action.payload
  //     })
  //     .addCase(incrementAsync.rejected, (state) => {
  //       state.status = "failed"
  //     })
  // },
})

export const {
  deleteRoute,
  addRoute,
  saveRoute,
  setSelectedRowKeys,
  updateCoords,
  getAPIRoute,
  setAPIRoute,
} = dataSlice.actions

export const selectData = (state: RootState) => state.data

// export const incrementIfOdd =
//   (amount: number): AppThunk =>
//   (dispatch, getState) => {
//     const currentValue = selectCount(getState())
//     if (currentValue % 2 === 1) {
//       dispatch(incrementByAmount(amount))
//     }
//   }

export default dataSlice.reducer
