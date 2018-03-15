export default format = function (number) {
  if (number && !isNaN(number)) {
    return parseFloat(number).toFixed(2);
  } else {
    return '0.00';
  }
}