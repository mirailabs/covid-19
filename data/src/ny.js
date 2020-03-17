const fetch = require("node-fetch");
const cheerio = require("cheerio");
const db = require("./db");

const URL =
  "https://coronavirus.health.ny.gov/county-county-breakdown-positive-cases";
const DOC = "us";
const STATE = "New York";

async function fetchData() {
  const response = await fetch(URL);
  if (!response.ok) {
    throw new Error(`[${response.status}] Server error`);
  }
  return response.text();
}

async function scrape() {
  const data = await fetchData();

  const $ = cheerio.load(data);
  return $("tr:last-child > td:last-child > strong")
    .text()
    .replace(",", "");
}

async function run() {
  try {
    const confirmed = await scrape();
    db.set(DOC, STATE, {
      State: STATE,
      "Last Update": new Date().toISOString(),
      Confirmed: Number(confirmed),
      Deaths: 0,
      Recovered: 0,
      Latitude: 30.9756,
      Longitude: 112.2707
    });
    console.log(`Updated ${STATE}`);
  } catch (error) {
    console.error(error);
  }
}

run();
