// export type Columns = [
//   "metric",
//   "jan",
//   "feb",
//   "mar",
//   "apr",
//   "may",
//   "jun",
//   "jul",
//   "aug",
//   "sep",
//   "oct",
//   "nov",
//   "dec",
//   "year"
// ]

export type MonthShort =
  | "metric"
  | "jan"
  | "feb"
  | "mar"
  | "apr"
  | "may"
  | "jun"
  | "jul"
  | "aug"
  | "sep"
  | "oct"
  | "nov"
  | "dec"
  | "year"

export type WeatherData = {
  [key: string]: {
    data:
      | {
          "average high": {
            metric: string
            jan: number
            feb: number
            mar: number
            apr: number
            may: number
            jun: number
            jul: number
            aug: number
            sep: number
            oct: number
            nov: number
            dec: number
            year: number
          }
          "average low": {
            metric: string
            jan: number
            feb: number
            mar: number
            apr: number
            may: number
            jun: number
            jul: number
            aug: number
            sep: number
            oct: number
            nov: number
            dec: number
            year: number
          }
          [key1: string]: {
            metric: string
            jan: number
            feb: number
            mar: number
            apr: number
            may: number
            jun: number
            jul: number
            aug: number
            sep: number
            oct: number
            nov: number
            dec: number
            year: number
          }
        }
      | {}
    columns: string[]
  }
}
