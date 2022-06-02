export type StateOrUt =
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
  | "andaman and nicobar islands ut"
  | "sikkim"
  | "goa"

export type PlacesData = {
  [key: string]: {
    elevation: number // m
    beachOrHill: "hills" | "beaches" | null
    aliases?: string[]
    population: number
    name: string
    stateOrUt: StateOrUt
    tier: 1 | 2 | 3
    latLong: [number, number]
    populationDensity: number // km^-2
    area: number // km^2
  }
}
