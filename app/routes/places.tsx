import { json } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"
import { placesData } from "data/placesData"
import type { PlacesData } from "data/placesData"
import type { LoaderFunction } from "@remix-run/node"
import { statesAndUts } from "data/statesAndUts"

export const loader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url)
  const hills = (url.searchParams.get("hills") as string) === "on"
  const beaches = (url.searchParams.get("beaches") as string) === "on"
  const rest = (url.searchParams.get("rest") as string) === "on"

  const selectedStates = url.searchParams.getAll("state")

  // when empty show all
  const filterBeachOrHill: (string | null)[] = []
  if (hills) {
    filterBeachOrHill.push("hills")
  }
  if (beaches) {
    filterBeachOrHill.push("beaches")
  }
  if (rest) {
    filterBeachOrHill.push(null)
  }

  let filteredPlacesData: PlacesData = {}
  Object.keys(placesData).forEach((place) => {
    if (filterBeachOrHill.includes(placesData[place].beachOrHill)) {
      filteredPlacesData[place] = placesData[place]
    }
  })

  if (!filterBeachOrHill.length) {
    filteredPlacesData = JSON.parse(JSON.stringify(placesData))
  }

  let filteredPlacesByState: PlacesData = {}
  Object.keys(filteredPlacesData).forEach((place) => {
    if (selectedStates.includes(filteredPlacesData[place].stateOrUt)) {
      filteredPlacesByState[place] = filteredPlacesData[place]
    }
  })

  if (!selectedStates.length) {
    filteredPlacesByState = JSON.parse(JSON.stringify(filteredPlacesData))
  }

  return json({
    places: filteredPlacesByState,
    matchedPlaces: Object.keys(filteredPlacesByState).length,
    totalPlaces: Object.keys(placesData).length,
    placeType: { hills, beaches, rest },
    selectedStates,
  })
}

export default function PlaceFinder() {
  const { places, placeType, totalPlaces, matchedPlaces, selectedStates } =
    useLoaderData()
  return (
    <main className="py-10 text-gray-800">
      <h1>Place Finder</h1>
      <Form method="get" className="mb-4">
        <div className="flex max-h-20">
          <fieldset className="ml-0 inline-block rounded border border-gray-300">
            <legend>Place type</legend>
            <p className="flex gap-3">
              <label className="">
                <input
                  type="checkbox"
                  name="hills"
                  defaultChecked={placeType.hills}
                />
                Hills
              </label>
              <label>
                <input
                  type="checkbox"
                  name="beaches"
                  defaultChecked={placeType.beaches}
                />
                Beaches
              </label>
              <label>
                <input
                  type="checkbox"
                  name="rest"
                  defaultChecked={placeType.rest}
                />
                Others
              </label>
            </p>
          </fieldset>
          <fieldset className="inline-block overflow-y-scroll rounded border border-gray-300">
            <legend>Choose state(s)</legend>
            {statesAndUts.map((s) => (
              <div key={s}>
                <input
                  type="checkbox"
                  id={`sut-${s}`}
                  name="state"
                  value={s}
                  defaultChecked={selectedStates.includes(s)}
                />
                <label className="capitalize" htmlFor={`sut-${s}`}>
                  {s}
                </label>
              </div>
            ))}
          </fieldset>
        </div>
        <p className="">
          <button type="submit" className="text-base">
            Get matching places
          </button>
        </p>
      </Form>
      <p>
        {matchedPlaces} of {totalPlaces} places matched
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        {/* <p>{JSON.stringify(places)}</p> */}
        {Object.keys(places).map((p, i) => (
          <div
            className="min-w-[260px] rounded border border-solid border-gray-200 p-4 "
            key={p}
          >
            <h2 className="my-0 capitalize">{p}</h2>
            <p className="mt-0 capitalize text-gray-400">
              {p === places[p].stateOrUt ? "" : `${places[p].stateOrUt}`}
            </p>
            <p className="capitalize text-gray-500">
              {places[p].beachOrHill === "hills"
                ? "🏔 "
                : places[p].beachOrHill === "beaches"
                ? "🏖 "
                : ""}
              {places[p].beachOrHill}
            </p>
            <p>
              {places[p].elevation !== null &&
                `Elevation: ${places[p].elevation} m`}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}
