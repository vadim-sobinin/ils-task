import React, { useEffect, useState } from "react"
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet"
import { useAppSelector } from "../../hooks/hooks"
import { selectData } from "../../redux/dataSlice"

import "../../scss/Map.scss"
import "leaflet/dist/leaflet.css"
import { LatLngExpression } from "leaflet"
import { getRouteFromAPI } from "../../servises/osrm"

const Map = () => {
  const { dataSource, selectedRoute } = useAppSelector(selectData)
  const coords = [
    dataSource[0].point1,
    dataSource[0].point2,
    dataSource[0].point3,
  ]

  const [points, setPoints] = useState<LatLngExpression[]>([])

  const getCoords = async () => {
    const apiRoutPoints = await getRouteFromAPI(coords)
    console.log(apiRoutPoints)
    setPoints(apiRoutPoints)
  }

  useEffect(() => {
    getCoords()
  }, [])

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

      {points && <Polyline positions={points} />}
    </MapContainer>
  )
}

export default Map
