export function range(start = 0, count) {
  return Array.apply(0, Array(count))
    .map((element, index) => {
      return index + start
    })
}
