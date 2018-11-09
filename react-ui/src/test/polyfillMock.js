/* eslint-disable */
export const raf = (global.requestAnimationFrame = cb => {
  setTimeout(cb, 0);
});

export const caf = (global.cancelAnimationFrame = cb => {
  setTimeout(cb, 0);
});
/* eslint-enable */
