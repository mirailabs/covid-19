const padTwo = s => s.padStart(2, "0");

exports.getFilename = function(date) {
  const month = padTwo((date.getUTCMonth() + 1).toString());
  const day = padTwo(date.getUTCDate().toString());
  const year = date.getUTCFullYear();
  return `${month}-${day}-${year}`;
};
