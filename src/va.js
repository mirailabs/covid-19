const fetch = require("node-fetch");
const cheerio = require("cheerio");
const db = require("./db");

// Source: http://www.vdh.virginia.gov/surveillance-and-investigation/novel-coronavirus/

const DOC = "us";
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
    const confirmed = await scrape();
    db.set(DOC, STATE, {
      State: STATE,
      "Last Update": new Date().toISOString(),
      Confirmed: Number(confirmed),
      Deaths: 0,
      Recovered: 0,
      Latitude: 37.7693,
      Longitude: -78.17
    });
    console.log(`Updated ${STATE}`);
  } catch (error) {
    console.error(error);
  }
}

run();
