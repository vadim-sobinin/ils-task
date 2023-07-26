import axios from "axios"
import { LatLngTuple } from "leaflet"

const API_ROOT = "https://router.project-osrm.org/route/v1/driving/"

// Function to generate OSRM API URL
function generateOSRMApiUrl(coordinates: LatLngTuple[]) {
  // Join coordinates into OSRM format
  const coordinatesString = coordinates
    .map((coord: LatLngTuple) => {
      return [coord[1], coord[0]].join(",")
    })
    .join(";")

  return `${API_ROOT}${coordinatesString}?overview=full&geometries=geojson`
}

export async function getRouteFromAPI(coordinates: LatLngTuple[]) {
  const url = generateOSRMApiUrl(coordinates)
  const response = await axios.get(url)
  if (response.data.code !== "Ok") {
    throw new Error("Failed to get route from OSRM")
  }
  const reversedCoords = response.data.routes[0].geometry.coordinates.map(
    (coords: any) => [coords[1], coords[0]],
  )
  return reversedCoords
}
