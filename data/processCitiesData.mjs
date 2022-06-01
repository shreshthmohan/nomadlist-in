import { readFileSync, writeFileSync } from "fs"
import { tsvParse } from "d3"

const citiesDataRaw = readFileSync("./cities.tsv").toString().toLowerCase()
const citiesDataParsed = tsvParse(citiesDataRaw)

const columns = citiesDataParsed.columns
const nc = "population_2011"
const removeColumns = ["population_2001", "rank"]
const errors = []
const citiesDataObj = {}
let statesAndUts = []
citiesDataParsed.forEach((city) => {
  if (Number.isNaN(Number.parseFloat(city[nc]))) {
    errors.push(`${city.city} ${nc} value (${city[nc]}) is not a number`)
  }
  if (!city.state_or_ut) {
    errors.push(`${city.city} doesn't have a state_or_ut field`)
  }
  statesAndUts.push(city.state_or_ut)
  city[nc] = Number.parseFloat(city[nc])
  removeColumns.forEach((rc) => {
    delete city[rc]
  })
  citiesDataObj[city.city] = city
})

statesAndUts = Array.from(new Set(statesAndUts))

console.log({ errors })

writeFileSync(
  "cities.mjs",
  `export default ${JSON.stringify(citiesDataObj)}
export const citiesDataFields = ${JSON.stringify(columns)}
export const statesAndUts = ${JSON.stringify(statesAndUts)}
`
)
