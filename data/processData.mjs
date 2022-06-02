// Read all files from ../data/tsv/

import { getAllFilesInDir } from "./getAllFiles.mjs"
import { readFileSync, writeFileSync } from "fs"
import { intersection } from "./intersection.mjs"
import { tsvParse } from "d3"
import { monthsShort } from "./monthLabels.mjs"
import { citiesByTiers } from "./cityTiers.mjs"
import citiesData, { statesAndUts } from "./cities.mjs"
import { placesData } from "./placesData.mjs"

export const lookFor = [
  { replace: /\brain(fall|y)\b/gi, with: "precipitation" },
  { replace: /\s+°C/gi, with: "" },
  { replace: /\s+mm/gi, with: "" },
  { replace: ",", with: "" },
  { replace: "−", with: "-" },
  { replace: /\s+\t/g, with: "\t" },
]

const onlyKeepCommonMetrics = true

export function processData() {
  const requiredMetrics = ["average high", "average low"]

  const allFilepaths = getAllFilesInDir("tsv")

  const placesWeatherData = {}
  const errors = []

  const allMetricLabels = []
  const eachPlacesMetrics = []

  // Read data from all weather data files and store in a variable
  allFilepaths.forEach(({ fullpath, filename }) => {
    const fileData = readFileSync(fullpath).toString().toLowerCase()
    const placeMetricLabels = []
    let cleanedFileData = fileData

    lookFor.forEach((sr) => {
      cleanedFileData = cleanedFileData.replaceAll(sr.replace, sr.with)
    })

    const placename = filename.split(".")[0]
    const parsedData = tsvParse(cleanedFileData)
    if (parsedData.columns.indexOf("metric") === -1) {
      errors.push(`metric column not present in ${filename}`)
    }
    if (parsedData.columns.indexOf("year") === -1) {
      errors.push(`year column not present in ${filename}`)
    }
    const parsedDataObj = { data: {}, columns: parsedData.columns }

    parsedData.forEach((metricData) => {
      const { metric } = metricData
      placeMetricLabels.push(metric)
      allMetricLabels.push(metric)
      parsedDataObj.data[metric] = metricData
      const monthsAndYear = monthsShort.slice()
      monthsAndYear.push("year")

      monthsAndYear.forEach((col) => {
        const d = Number.parseFloat(parsedDataObj.data[metric][col])
        if (Number.isNaN(d)) {
          errors.push(
            `In ${filename}, metric ${metric} for column ${col}, ${d} ${parsedDataObj.data[metric][col]} cannot be parsed as a number`
          )
        }
        parsedDataObj.data[metric][col] = d
      })
    })
    parsedData.metrics = placeMetricLabels
    eachPlacesMetrics.push(placeMetricLabels)
    requiredMetrics.forEach((m) => {
      if (placeMetricLabels.indexOf(m) === -1) {
        errors.push(`${m} data not present in ${filename}`)
      }
    })
    placesWeatherData[placename] = parsedDataObj
  })

  // console.log(placesWeatherData.goa)

  const commonMetrics = intersection(eachPlacesMetrics)

  if (onlyKeepCommonMetrics) {
    Object.keys(placesWeatherData).forEach((place) => {
      Object.keys(placesWeatherData[place].data).forEach((metric) => {
        if (commonMetrics.indexOf(metric) === -1) {
          delete placesWeatherData[place].data[metric]
        }
      })
    })
  }

  const placesDataNew = {}
  // get all cities in placesWeatherData

  Object.keys(placesWeatherData).forEach((place) => {
    if (placesData[place]?.stateOrUt) {
      const stateOrUt = placesData[place]?.stateOrUt
      if (statesAndUts.indexOf(stateOrUt) === -1) {
        errors.push(`Invalid state/UT value, ${stateOrUt} for ${place}`)
      }
    }
    placesDataNew[place] = {
      tier: citiesByTiers[place] ?? 3,
      elevation: placesData[place]?.elevation ?? null,
      beachOrHill: placesData[place]?.beachOrHill ?? null,
      population:
        citiesData[place]?.population_2011 ??
        placesData[place]?.population ??
        null,
      stateOrUt:
        citiesData[place]?.state_or_ut ?? placesData[place]?.stateOrUt ?? null,
      name: place,
      latLong: placesData[place]?.latLong ?? null,
      populationDensity: placesData[place]?.populationDensity ?? null,
      area: placesData[place].area ?? null,
    }
  })

  console.log({ errors })
  return {
    weatherData: placesWeatherData,
    commonMetrics,
    uniqueMetrics: Array.from(new Set(allMetricLabels)),
    placesData: placesDataNew,
    errors,
  }
}

const processedData = processData()

writeFileSync(
  "data.ts",
  `export default ${JSON.stringify(processedData.weatherData)}\n` +
    `export const commonMetrics = ${JSON.stringify(
      processedData.commonMetrics
    )}\n` +
    `export const uniqueMetrics = ${JSON.stringify(
      processedData.uniqueMetrics
    )}\n` +
    `export const errors = ${JSON.stringify(processedData.errors)}\n`
)

writeFileSync(
  "placesData.mjs",
  `export const placesData = ${JSON.stringify(processedData.placesData)}\n`
)
