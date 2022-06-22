export type StateOrUt =
  | "meghalaya"
  | "maharashtra"
  | "delhi"
  | "karnataka"
  | "telangana"
  | "gujarat"
  | "tamil nadu"
  | "west bengal"
  | "rajasthan"
  | "uttar pradesh"
  | "madhya pradesh"
  | "andhra pradesh"
  | "bihar"
  | "punjab"
  | "jharkhand"
  | "haryana"
  | "jammu and kashmir"
  | "chhattisgarh"
  | "chandigarh"
  | "assam"
  | "odisha"
  | "kerala"
  | "uttarakhand"
  | "tripura"
  | "puducherry"
  | "mizoram"
  | "manipur"
  | "himachal pradesh"
  | "andaman and nicobar islands"
  | "sikkim"
  | "goa"
  | "arunachal pradesh"
  | "nagaland"
  | "ladakh"

type Highlight = string | string[]

export type PlacesData = {
  [key: string]: {
    elevation: number // m
    beachOrHill: "hills" | "beaches" | null
    aliases?: string[] | null
    population: number | null
    name: string
    district: string | null
    stateOrUt: StateOrUt
    tier: 1 | 2 | 3
    latLong: [number, number] | null
    populationDensity: number | null // km^-2
    area: number | null // km^2
    highlights: Highlight[] | null
    offbeat: boolean | null
  }
}
