import { Form, useLoaderData } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { suitablePlacesAndMonths } from "../../data/suitablePlaces.server"
import weatherData from "../../data/data"
import type { WeatherData } from "data/weatherDataTypes"
import { monthsShort } from "data/monthLabels"
import { timeFormat } from "d3"
import { capitalizeFirstLetter } from "utils/capitalizeFirstLetter"
import { unitsForMetrics } from "data/units"

type Metrics = keyof typeof unitsForMetrics

// TODO: min-max from user input data

const comfortTemperateDefaultRange = [12, 27]

export const loader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url)
  const minComfortTempParsed = Number.parseFloat(
    url.searchParams.get("min-comfort-temp") as string
  )
  const minComfortTemp = Number.isNaN(minComfortTempParsed)
    ? comfortTemperateDefaultRange[0]
    : minComfortTempParsed
  const maxComfortTempParsed = Number.parseFloat(
    url.searchParams.get("max-comfort-temp") as string
  )
  const maxComfortTemp = Number.isNaN(maxComfortTempParsed)
    ? comfortTemperateDefaultRange[1]
    : maxComfortTempParsed

  const matchingPlacesAndMonths = suitablePlacesAndMonths(weatherData, [
    minComfortTemp,
    maxComfortTemp,
  ])

  const filteredWeatherData: WeatherData = {}
  Object.keys(matchingPlacesAndMonths).forEach((place) => {
    const p = place as keyof typeof weatherData
    filteredWeatherData[p] = weatherData[p]
  })
  const currentMonth = timeFormat("%b")(new Date()).toLowerCase()
  // console.log({ currentMonth: currentMonth.toLowerCase() })

  return json({
    filteredWeatherData,
    matchingPlacesAndMonths,
    currentMonth,
    comfortTemperatureRange: [minComfortTemp, maxComfortTemp],
    totalPlaces: Object.keys(weatherData).length,
  })
}

export default function ClimateFinder() {
  // const matchingPlacesAndMonths = useActionData()
  // console.log({ matchingPlacesAndMonths })
  const {
    filteredWeatherData: weatherData,
    matchingPlacesAndMonths,
    currentMonth,
    comfortTemperatureRange,
    totalPlaces,
  } = useLoaderData()
  // console.log({ weatherData })

  return (
    <main className="py-10">
      <div className="mx-auto max-w-screen-lg">
        <h1>Climate Finder</h1>
        <Form method="get">
          <p className="flex gap-2">
            <label className="inline-block">
              Minumum Temperature
              <input
                type="number"
                name="min-comfort-temp"
                className="ml-2 w-10"
                defaultValue={comfortTemperatureRange[0]}
              />
            </label>
            <label className="inline-block">
              Maximum Temperature
              <input
                type="number"
                name="max-comfort-temp"
                className="ml-2 w-10"
                defaultValue={comfortTemperatureRange[1]}
              />
            </label>
          </p>

          <p className="">
            <button type="submit" className="text-base">
              Get matching places
            </button>
          </p>
        </Form>
        <div className="pb-4">
          <p>
            {" "}
            {Object.keys(weatherData).length} of {totalPlaces} places matched
          </p>
          {Object.keys(weatherData).map((place) => (
            <div key={place} className="flex-column mb-4 flex justify-center">
              <div className="">
                <table className="w-full table-fixed border-collapse border border-solid border-gray-200">
                  <colgroup>
                    {["metric", ...monthsShort].map((col, i) => (
                      <col
                        key={`${col}-${i}`}
                        span={1}
                        style={{ width: i === 0 ? "16%" : "7%" }}
                      />
                    ))}
                  </colgroup>
                  <thead className="bg-gray-50">
                    <tr className="divide-x divide-gray-200 border-b border-t-0 border-l-0 border-r-0 border-solid">
                      {[place, ...monthsShort].map((m, i) => (
                        <th
                          key={m}
                          className="py-2 text-center text-sm capitalize text-gray-600"
                          style={{
                            borderTop:
                              currentMonth === m ? "2px solid #444" : undefined,
                            borderLeft:
                              currentMonth === m ? "2px solid #444" : undefined,
                            borderRight:
                              currentMonth === m ? "2px solid #444" : undefined,
                          }}
                        >
                          <span className={`${i === 0 && "font-bold"}`}>
                            {m}
                            {/* {i == 0 ? capitalizeFirstLetter(m) : m} */}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {Object.keys(weatherData[place].data).map((metric, im) => (
                      <tr className="" key={`${metric}-${place}`}>
                        {Object.keys(weatherData[place].data[metric])
                          .slice(0, 13)
                          .map((col, i) => (
                            <td
                              className={`${
                                matchingPlacesAndMonths[place]
                                  ? matchingPlacesAndMonths[place].indexOf(
                                      col
                                    ) > -1
                                    ? "border-white bg-green-200"
                                    : "border-gray-200"
                                  : ""
                              } break-words border-x-0 border-b border-t-0 border-solid py-2 text-center text-sm text-gray-600`}
                              key={`${metric}-${place}-${col}`}
                              style={{
                                borderLeft:
                                  currentMonth === col
                                    ? "2px solid #444"
                                    : undefined,
                                borderRight:
                                  currentMonth === col
                                    ? "2px solid #444"
                                    : undefined,
                                borderBottom:
                                  im ===
                                    Object.keys(weatherData[place].data)
                                      .length -
                                      1 && currentMonth === col
                                    ? "2px solid #444"
                                    : undefined,
                              }}
                            >
                              <span>
                                {i === 0
                                  ? `${capitalizeFirstLetter(
                                      weatherData[place].data[metric][col]
                                    )} ${
                                      unitsForMetrics[
                                        weatherData[place].data[metric][
                                          col
                                        ] as Metrics
                                      ]
                                        ? `(${
                                            unitsForMetrics[
                                              weatherData[place].data[metric][
                                                col
                                              ] as Metrics
                                            ]
                                          })`
                                        : ""
                                    }`
                                  : weatherData[place].data[metric][col]}
                              </span>
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
