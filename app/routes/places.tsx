import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { placesData } from "data/placesData"
import type { PlacesData } from "data/placesData"
import type { LoaderFunction } from "@remix-run/node"

export const loader: LoaderFunction = () => {
  return json({
    places: placesData,
  })
}

export default function PlaceFinder() {
  const { places } = useLoaderData()
  return (
    <main className="py-10 text-gray-800">
      <div className="mx-auto max-w-screen-lg">
        <h1>Place Finder</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          {/* <p>{JSON.stringify(places)}</p> */}
          {Object.keys(places).map((p, i) => (
            <div
              className="rounded border border-solid border-gray-200 p-4 "
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
                {places[p].elevation && `Elevation: ${places[p].elevation} m`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
