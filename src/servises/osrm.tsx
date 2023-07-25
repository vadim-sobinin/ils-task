import axios from "axios"
import { LatLngTuple } from "leaflet"

//`http://router.project-osrm.org/route/v1/car/59.84660399,30.29496392;59.82934196,30.42423701?overview=full&geometries=geojson`

const API_ROOT = "https://routing.openstreetmap.de/routed-car/route/v1/driving/"

// Function to generate OSRM API URL
function generateOSRMApiUrl(coordinates: LatLngTuple[]) {
  // Join coordinates into OSRM format
  const coordinatesString = coordinates
    .map((coord: LatLngTuple) => {
      return [coord[1], coord[0]].join(",")
    })
    .join(";")
  console.log(
    `${API_ROOT}${coordinatesString}?overview=false&alternatives=true&steps=true`,
  )
  return `${API_ROOT}${coordinatesString}?overview=false&alternatives=true&steps=true`
}

export async function getRouteFromAPI(coordinates: LatLngTuple[]) {
  const url = generateOSRMApiUrl(coordinates)
  const response = await axios.get(url)
  if (response.data.code !== "Ok") {
    throw new Error("Failed to get route from OSRM")
  }

  const coordsLegs = response.data.routes[0].legs
  const coordsArray: any[] = []
  coordsLegs.forEach((leg: any) =>
    leg.steps.map((point: any) =>
      coordsArray.push(point.maneuver.location.reverse()),
    ),
  )
  console.log(response.data)
  return coordsArray
}
