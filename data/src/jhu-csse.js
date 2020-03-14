const fetch = require("node-fetch");
const fs = require("fs");
const util = require("./util");

// Source: https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data
// File naming convention is MM-DD-YYYY.csv in UTC
// Updates happen once a day at 23:59 UTC

const DIR = "db/jhu-csse";

function today() {
  const date = new Date();
  // We want the previous day since the updates happen a minute before midnight.
  date.setDate(date.getDate() - 1);
  return util.getTimestamp(date);
}

async function fetchData(file) {
  const response = await fetch(
    `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${file}`
  );
  if (!response.ok) {
    throw new Error(`[${response.status}] Server error`);
  }
  return response.text();
}

async function run() {
  try {
    const file = `${today()}.csv`;
    const data = await fetchData(file);
    console.log("Successfully fetched data!");
    console.log(data);
    fs.mkdirSync(DIR, { recursive: true });
    fs.writeFileSync(`${DIR}/${file}`, data);
  } catch (error) {
    console.error(error);
  }
}

run();
