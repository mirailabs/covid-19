const fetch = require("node-fetch");
const cheerio = require("cheerio");
const fs = require("fs");
const csv2json = require("csvjson-csv2json");
const json2csv = require("csvjson-json2csv");
const util = require("./util");

// Source: https://health.ny.gov/diseases/communicable/coronavirus/

const DIR = "data/us";
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
  const stateWideRow = totalRows[1];
  const stateWideCases = $("td", stateWideRow)[1];
  return $(stateWideCases).text();
}

async function run() {
  try {
    const file = `${util.getFilename(new Date())}.csv`;
    const path = `${DIR}/${file}`;

    const confirmed = await scrape();
    if (isNaN(confirmed)) {
      throw new TypeError(
        `Expected a number for confirmed cases, but got ${confirmed}`
      );
    }

    const record = {
      State: STATE,
      "Last Update": new Date().toISOString(),
      Confirmed: Number(confirmed),
      Deaths: 0,
      Recovered: 0,
      Latitude: 30.9756,
      Longitude: 112.2707
    };

    let json;
    try {
      const csv = fs.readFileSync(`${DIR}/${file}`, { encoding: "utf8" });
      json = csv2json(csv);
    } catch (error) {
      // assume file does not exist
      console.warn(error);
    }

    if (json) {
      prevRecord = json.filter(r => r.state === STATE);
      if (prevRecord) {
        prevRecord.Confirmed = confirmed;
      } else {
        json.push(record);
      }
    } else {
      json = record;
    }

    const csv = json2csv(record);
    fs.mkdirSync(DIR, { recursive: true });
    fs.writeFileSync(path, csv);
    console.log(`Updated '${path}' with the latest data from ${STATE}`);
  } catch (error) {
    console.error(error);
  }
}

run();
