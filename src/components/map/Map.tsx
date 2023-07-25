import React from "react"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import { useAppSelector } from "../../hooks/hooks"
import { selectData } from "../../redux/dataSlice"

import "../../scss/Map.scss"
import "leaflet/dist/leaflet.css"

const Map = () => {
  const { dataSource, selectedRoute } = useAppSelector(selectData)
  const coords = dataSource[0].point1

  return (
    <MapContainer
      center={[coords[0], coords[1]]}
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[coords[0], coords[1]]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  )
}

export default Map
