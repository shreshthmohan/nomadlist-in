import { Form, useLoaderData } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { suitablePlacesAndMonths } from "../../data/suitablePlaces.server"
import weatherData from "../../data/data"
import type { WeatherData } from "data/weatherDataTypes"
import { monthsShort } from "data/monthLabels"
import { timeFormat } from "d3"

const comfortTemperateDefaultRange = [12, 27]

export const loader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url)
  // const  minComfortTempRaw = url.searchParams.get("min-comfort-temp")
  const minComfortTemp = Number.parseFloat(
    (url.searchParams.get("min-comfort-temp") as string) ??
      comfortTemperateDefaultRange[0]
  )

  const maxComfortTemp = Number.parseFloat(
    (url.searchParams.get("max-comfort-temp") as string) ??
      comfortTemperateDefaultRange[1]
  )
  // console.log([weatherData, minComfortTemp, maxComfortTemp])
  const matchingPlacesAndMonths = suitablePlacesAndMonths(weatherData, [
    minComfortTemp,
    maxComfortTemp,
  ])

  // console.log("loader matched places:", matchingPlacesAndMonths)

  const filteredWeatherData: WeatherData = {}
  Object.keys(matchingPlacesAndMonths).forEach((place) => {
    const p = place as keyof typeof weatherData
    filteredWeatherData[p] = weatherData[p]
  })
  const currentMonth = timeFormat("%b")(new Date()).toLowerCase()
  // console.log({ currentMonth: currentMonth.toLowerCase() })

  return json({ filteredWeatherData, matchingPlacesAndMonths, currentMonth })
}

export default function ClimateFinder() {
  // const matchingPlacesAndMonths = useActionData()
  // console.log({ matchingPlacesAndMonths })
  const {
    filteredWeatherData: weatherData,
    matchingPlacesAndMonths,
    currentMonth,
  } = useLoaderData()
  // console.log({ weatherData })

  return (
    <main className="py-10">
      <div className="mx-auto max-w-screen-lg">
        <h1>Climate Finder</h1>
        <Form method="get">
          <p>
            <label>
              Minumum Temperature
              <input
                type="number"
                name="min-comfort-temp"
                className="ml-2"
                defaultValue={comfortTemperateDefaultRange[0]}
              />
            </label>
          </p>
          <p>
            <label>
              Maximum Temperature
              <input
                type="number"
                name="max-comfort-temp"
                className="ml-2"
                defaultValue={comfortTemperateDefaultRange[1]}
              />
            </label>
          </p>
          <p className="text-right">
            <button type="submit" className="text-base">
              Get matching places
            </button>
          </p>
        </Form>
        <div className="py-4">
          {Object.keys(weatherData).map((place) => (
            <div key={place} className="flex-column mb-4 flex justify-center">
              <div className="">
                <table className="table-fixed border-collapse border border-solid border-gray-200">
                  <colgroup>
                    {["metric", ...monthsShort].map((col, i) => (
                      <col
                        key={`${col}-${i}`}
                        span={1}
                        style={{ width: i === 0 ? "150px" : "85px" }}
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
                              currentMonth === m ? "2px solid #444" : "",
                            borderLeft:
                              currentMonth === m ? "2px solid #444" : "",
                            borderRight:
                              currentMonth === m ? "2px solid #444" : "",
                          }}
                        >
                          <span className={`${i === 0 && "font-bold"}`}>
                            {m}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {Object.keys(weatherData[place].data).map((metric, im) => (
                      <tr
                        className="divide-x divide-gray-200 border border-solid "
                        key={`${metric}-${place}`}
                      >
                        {Object.keys(weatherData[place].data[metric])
                          .slice(0, 13)
                          .map((col, i) => (
                            <td
                              className={`${
                                matchingPlacesAndMonths[place]
                                  ? matchingPlacesAndMonths[place].indexOf(
                                      col
                                    ) > -1
                                    ? "bg-green-200"
                                    : ""
                                  : ""
                              } break-words border border-solid border-gray-200 py-2 text-center text-sm text-gray-600`}
                              key={`${metric}-${place}-${col}`}
                              style={{
                                borderLeft:
                                  currentMonth === col ? "2px solid #444" : "",
                                borderRight:
                                  currentMonth === col ? "2px solid #444" : "",
                                borderBottom:
                                  im ===
                                    Object.keys(weatherData[place].data)
                                      .length -
                                      1 && currentMonth === col
                                    ? "2px solid #444"
                                    : "",
                              }}
                            >
                              <span>
                                {weatherData[place].data[metric][col]}
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
