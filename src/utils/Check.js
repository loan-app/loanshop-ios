export default AuthCheck = function (array, level, router, params) {
  if (!array[0].routeName || array[level].checked) {
    return [router, params];
  } else {
    let i = 0;
    for (i; i <= level; i++) {
      if (!array[i].checked) {
        return [array[i].routeName];
      }
    }
  }
}