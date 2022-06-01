import { readFileSync, writeFileSync } from "fs"
import { tsvParse } from "d3"

const citiesDataRaw = readFileSync("./cities.tsv").toString().toLowerCase()
const citiesDataParsed = tsvParse(citiesDataRaw)

const columns = citiesDataParsed.columns
const nc = "population_2011"
const removeColumns = ["population_2001", "rank"]
const errors = []
citiesDataParsed.forEach((city) => {
  if (Number.isNaN(Number.parseFloat(city[nc]))) {
    errors.push(`${city.city} ${nc} value (${city[nc]}) is not a number`)
  }
  city[nc] = Number.parseFloat(city[nc])
  removeColumns.forEach((rc) => {
    delete city[rc]
  })
})

console.log({ errors })

writeFileSync(
  "cities.ts",
  `export default ${JSON.stringify(citiesDataParsed)}
export const citiesDataFields = ${JSON.stringify(columns)}
`
)
