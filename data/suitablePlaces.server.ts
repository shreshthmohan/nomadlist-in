import { min, max } from "d3"
import type { WeatherData, MonthShort } from "./weatherDataTypes"
import { monthsShort } from "./monthLabels"

export function suitablePlacesAndMonths(
  data: WeatherData,
  comfortTempRange: [number, number]
) {
  // handle case when comfortTempRange is either empty array or undefined: pass-through filter
  const allPlaces = Object.keys(data)
  // TODO handle case when only one value is provided in comfortTempRange
  const minComfort = min(comfortTempRange) as number
  const maxComfort = max(comfortTempRange) as number
  const matchingPlacesAndMonths: { [key: string]: MonthShort[] } = {}
  allPlaces.forEach((place) => {
    let matchingMonthsForThisPlace: MonthShort[] = []
    monthsShort.forEach((month: MonthShort) => {
      // const x = data[place].data["average high"][month]
      const avgHigh = Number.parseFloat(
        data[place].data["average high"][month] as string
      )
      const avgLow = Number.parseFloat(
        data[place].data["average low"][month] as string
      )
      if (
        avgHigh < maxComfort &&
        avgHigh > minComfort &&
        avgLow > minComfort &&
        avgLow < maxComfort
      ) {
        matchingMonthsForThisPlace.push(month)
      }
    })
    if (matchingMonthsForThisPlace.length) {
      matchingPlacesAndMonths[place] = matchingMonthsForThisPlace
    }
  })
  return matchingPlacesAndMonths
}
