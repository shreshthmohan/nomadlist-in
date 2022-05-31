const allDates = document.getElementsByClassName("monthly-daypanel")

const dates = []

const cData = []

Array.from(allDates).forEach((ch) => {
  const date = ch.children[0]?.textContent.trim()
  if (dates.indexOf(date) === -1 && date) {
    dates.push(date)
    cData.push({
      date,
      high: ch.children[1]?.children[0]?.textContent.trim(),
      low: ch.children[1]?.children[1]?.textContent.trim(),
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

console.log(avgLow, avgHigh, datesCount)
