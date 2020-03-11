const fetch = require("node-fetch");
const cheerio = require("cheerio");
const fs = require("fs");
const csv2json = require("csvjson-csv2json");
const json2csv = require("csvjson-json2csv");
const util = require("./util");

// Source: http://www.vdh.virginia.gov/surveillance-and-investigation/novel-coronavirus/

const DIR = "data/us";
const STATE = "Virginia";

async function fetchData() {
  const response = await fetch(
    "http://www.vdh.virginia.gov/surveillance-and-investigation/novel-coronavirus/"
  );
  if (!response.ok) {
    throw new Error(`[${response.status}] Server error`);
  }
  return response.text();
}

async function scrape() {
  const data = await fetchData();

  const matches = data.match(
    /Number of Presumptive Positive or Confirmed Cases: (\d+)/
  );
  if (!matches) {
    throw new Error("Failed to scrape data");
  }
  return Number(matches[1]);
}

async function run() {
  try {
    const file = `${util.getFilename(new Date())}.csv`;
    const path = `${DIR}/${file}`;

    const confirmed = await scrape();

    const record = {
      State: STATE,
      "Last Update": new Date().toISOString(),
      Confirmed: Number(confirmed),
      Deaths: 0,
      Recovered: 0,
      Latitude: 37.7693,
      Longitude: -78.17
    };

    let json;
    try {
      const csv = fs.readFileSync(`${DIR}/${file}`, { encoding: "utf8" });
      json = csv2json(csv, { parseNumbers: true });
    } catch (error) {
      // assume file does not exist
      console.warn(error);
    }

    if (json) {
      prevRecord = json.find(r => r.State === STATE);
      if (prevRecord) {
        prevRecord.Confirmed = confirmed;
      } else {
        json.push(record);
      }
    } else {
      json = [record];
    }

    const csv = json2csv(json);
    fs.mkdirSync(DIR, { recursive: true });
    fs.writeFileSync(path, csv);
    console.log(`Updated '${path}' with the latest data from ${STATE}`);
  } catch (error) {
    console.error(error);
  }
}

run();
