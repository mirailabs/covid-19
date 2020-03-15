const fetch = require("node-fetch");
const cheerio = require("cheerio");
const db = require("./db");

// Source: https://health.ny.gov/diseases/communicable/coronavirus/

const DOC = "us";
const STATE = "New York";

async function fetchData() {
  const response = await fetch(
    `https://health.ny.gov/diseases/communicable/coronavirus/`
  );
  if (!response.ok) {
    throw new Error(`[${response.status}] Server error`);
  }
  return response.text();
}

async function scrape() {
  const data = await fetchData();

  const $ = cheerio.load(data);
  const totalRows = $("tr.total_row");
  const stateWideRow = totalRows[2];
  const stateWideCases = $("td", stateWideRow)[1];
  return $(stateWideCases).text();
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
