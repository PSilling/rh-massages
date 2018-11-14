const notify = jest.fn();
const clearAllIntervals = jest.fn();
const getEventLink = jest.fn();

const isEmpty = jest.fn(object => object === null || typeof object === "undefined" || object === "");

const findInArrayById = jest.fn((array, id) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].id === id) {
      return i;
    }
  }
  return -1;
});

let tooltipCount = 0;
const getTooltipTargets = jest.fn(count => {
  const targets = [];
  for (let i = 0; i < count; i++) {
    targets.push(`Tooltip${tooltipCount++}`);
  }
  return targets;
});

module.exports = {
  notify,
  clearAllIntervals,
  getEventLink,
  isEmpty,
  findInArrayById,
  tooltipCount,
  getTooltipTargets
};
