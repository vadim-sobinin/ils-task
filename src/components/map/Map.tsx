import "../../scss/Map.scss"
import "leaflet/dist/leaflet.css"

import React, { useEffect, useState } from "react"
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet"
import { useAppSelector } from "../../hooks/hooks"
import { selectData } from "../../redux/dataSlice"
import { LatLngExpression, LatLngTuple } from "leaflet"
import { getRouteFromAPI } from "../../servises/osrm"

const Map = () => {
  const { dataSource, selectedRoute } = useAppSelector(selectData)

  const [pathCoordsArr, setPathCoordsArr] = useState<LatLngExpression[][]>([])

  const getCoords = async () => {
    if (selectedRoute) {
      const coordsLeg1 = await getRouteFromAPI([
        selectedRoute.point1,
        selectedRoute.point2,
      ])
      const coordsLeg2 = await getRouteFromAPI([
        selectedRoute.point2,
        selectedRoute.point3,
      ])
      setPathCoordsArr([coordsLeg1, coordsLeg2])
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
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {selectedRoute && (
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
      {pathCoordsArr[0] && pathCoordsArr[0] && (
        <>
          <Polyline
            positions={pathCoordsArr[0]}
            pathOptions={{ color: "blue" }}
          />
          <Polyline
            positions={pathCoordsArr[1]}
            pathOptions={{ color: "red" }}
          />
        </>
      )}
      <ResetCenterView />
    </MapContainer>
  )
}

export default Map
