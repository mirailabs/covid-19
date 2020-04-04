const fs = require("fs");
const util = require("./util");
const db = require("./db");

// Source: https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data
// File naming convention is MM-DD-YYYY.csv in UTC
// Updates happen once a day at 23:59 UTC

const DIR = "jhu-csse";

function today() {
  const date = new Date();
  // We want the previous day since the updates happen a minute before midnight.
  date.setDate(date.getDate() - 1);
  return util.getTimestamp(date);
}

async function fetchData(file) {
  const response = await util.fetch(
    `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${file}`
  );
  return response.text();
}

async function run() {
  try {
    const file = `${today()}.csv`;
    const path = `${DIR}/${file}`;
    const data = await fetchData(file);

    db.writeFile(path, data);

    console.log(`Updated ${path}`);
  } catch (error) {
    console.error(error);
  }
}

run();
