import "../../scss/Map.scss"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"

import React, { useEffect } from "react"
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet"
import { useAppDispatch, useAppSelector } from "../../hooks/hooks"
import { getAPIRoute, selectData } from "../../redux/dataSlice"
import { LatLngTuple } from "leaflet"
import ClipLoader from "react-spinners/ClipLoader"
import "leaflet-defaulticon-compatibility"

const Map = () => {
  const { dataSource, selectedRoute, routeCoords, status } =
    useAppSelector(selectData)

  const dispatch = useAppDispatch()
  const getCoords = async () => {
    if (selectedRoute) {
      dispatch(
        // @ts-ignore
        getAPIRoute([
          [selectedRoute.point1, selectedRoute.point2],
          [selectedRoute.point2, selectedRoute.point3],
        ]),
      )
    }
  }

  useEffect(() => {
    if (selectedRoute) {
      getCoords()
    }
  }, [selectedRoute])

  let mapCenterCoords: LatLngTuple | undefined = undefined

  function ResetCenterView() {
    const map = useMap()
    selectedRoute &&
      map.fitBounds([
        selectedRoute?.point1,
        selectedRoute?.point2,
        selectedRoute.point3,
      ])
    return null
  }

  return (
    <MapContainer
      center={mapCenterCoords ? mapCenterCoords : dataSource[0].point1}
      zoom={9}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {selectedRoute && status !== "failed" && (
        <>
          <Marker position={selectedRoute.point1}>
            <Popup>Первая метка</Popup>
          </Marker>
          <Marker position={selectedRoute.point2}>
            <Popup>Вторая метка</Popup>
          </Marker>
          <Marker position={selectedRoute.point3}>
            <Popup>Третья метка</Popup>
          </Marker>
        </>
      )}
      {status === "idle" && routeCoords[0] && routeCoords[0] && (
        <>
          <Polyline
            positions={routeCoords[0]}
            pathOptions={{ color: "blue" }}
          />
          <Polyline positions={routeCoords[1]} pathOptions={{ color: "red" }} />
        </>
      )}
      <ResetCenterView />

      {status !== "idle" && (
        <div className="message-container">
          {status === "loading" && (
            <ClipLoader
              color="#36d7b7"
              loading={true}
              size={150}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          )}

          {status === "failed" && (
            <p className="error-text">
              Произошла ошибка при загрузке данных... <br />
              Пожалуйста, проверьте соедениние с интернетом
            </p>
          )}
        </div>
      )}
    </MapContainer>
  )
}

export default Map
