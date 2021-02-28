const zeroPad = (num, places) => String(num).padStart(places, "0");

const makeReleaseString = (
  year: number,
  month: number,
  day: number
): string => {
  return `${zeroPad(year, 4)}-${zeroPad(month, 2)}-${zeroPad(day, 2)}`;
};

export { makeReleaseString };
