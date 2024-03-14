const getStartEnd = (range: string) => {
  const [start, end] = range.split("-");

  return [Number(start), Number(end)];
};

const isRange = (range: string) => {
  const [start, end] = getStartEnd(range);

  if (range.includes("-") && start <= end) {
    return true;
  }
  return false;
};

const splitRangeIntoPages = (range: string) => {
  const [start, end] = getStartEnd(range);

  const pages = Array.from({ length: end - start + 1 }, (_, i) => {
    return start + i;
  });

  return pages;
};

export const getPagesFromRange = (range: string) => {
  const pagesArray = range.split(",").map((page) => page.trim());

  const pagesToPrint = [];

  pagesArray.forEach((page) => {
    if (isRange(page)) {
      pagesToPrint.push(...splitRangeIntoPages(page));
    } else if (Number(page)) {
      pagesToPrint.push(Number(page));
    }
  });

  return pagesToPrint;
};
