const allDates = document.getElementsByClassName("monthly-daypanel")

const dates = []

const cData = []

Array.from(allDates).forEach((ch) => {
  const date = ch.children[0]?.textContent.trim()
  if (dates.indexOf(date) === -1 && date) {
    // handle case when table doesn't start with 1st of the month
    dates.push(date)
    const l = ch.children[1].children ? ch.children[1].children.length : 0

    cData.push({
      date,
      high: ch.children[1].children[0]?.textContent.trim(),
      low: ch.children[1].children[1]?.textContent.trim(),
    })
  }
})

let avgLowSum = 0
let avgHighSum = 0
let datesCount = 0

cData.forEach((d) => {
  if (d.date && d.high && d.low) {
    const h = Number.parseFloat(d.high.replaceAll("°", ""))
    const l = Number.parseFloat(d.low.replaceAll("°", ""))
    avgLowSum += l
    avgHighSum += h
    datesCount++
  }
})

const avgLow = avgLowSum / datesCount
const avgHigh = avgHighSum / datesCount
const month = document
  .getElementsByClassName("map-dropdown-toggle")[0]
  .textContent.trim()

console.log(avgLow.toFixed(0), avgHigh.toFixed(0), datesCount, month)
// console.log(avgLow, avgHigh, datesCount, month)
