import React, { useEffect, useState } from "react"
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet"
import { useAppSelector } from "../../hooks/hooks"
import { selectData } from "../../redux/dataSlice"

import "../../scss/Map.scss"
import "leaflet/dist/leaflet.css"
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
      // console.log([coordsLeg1, coordsLeg2])
      setPathCoordsArr([coordsLeg1, coordsLeg2])
    }
  }

  useEffect(() => {
    if (selectedRoute) {
      getCoords()
    }
  }, [selectedRoute])

  return (
    <MapContainer
      center={dataSource[0].point1}
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
      {selectedRoute && pathCoordsArr && (
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
    </MapContainer>
  )
}

export default Map
