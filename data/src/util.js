const fetch = require("node-fetch");

const padTwo = s => s.padStart(2, "0");

exports.getTimestamp = function(date) {
  const month = padTwo((date.getUTCMonth() + 1).toString());
  const day = padTwo(date.getUTCDate().toString());
  const year = date.getUTCFullYear();
  return `${month}-${day}-${year}`;
};

const okOrThrow = function(resp) {
  if (!resp.ok) {
    throw new Error(`[${resp.status}] Server error`);
  }
};

exports.fetch = async function(url) {
  const response = await fetch(url);
  okOrThrow(response);
  return response;
};
