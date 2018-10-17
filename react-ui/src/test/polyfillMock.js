/* eslint-disable */
const raf = (global.requestAnimationFrame = cb => {
  setTimeout(cb, 0);
});
/* eslint-enable */

export default raf;
