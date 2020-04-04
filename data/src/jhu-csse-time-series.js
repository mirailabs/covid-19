const fs = require("fs");
const util = require("./util");
const csv2json = require("csvjson-csv2json");
const db = require("./db");

// Source: https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series
// Updates happen once a day before midnight UTC

const PATH = "jhu-csse/time_series_latest.json";

async function fetchFile(file) {
  const response = await util.fetch(file);
  return response.text();
}

function consolidate(series, title) {
  const isDate = s => s.match(/\d+\/\d+\/\d+/);
  let regions = series.map(region => {
    return Object.keys(region).reduce(
      (acc, k) => {
        if (isDate(k)) {
          // consolidate
          acc[title].push(region[k]);
        } else {
          acc[k] = region[k];
        }
        return acc;
      },
      { [title]: [] }
    );
  });
  return {
    dates: Object.keys(series[0]).filter(isDate),
    regions
  };
}

function merge(c, d, r) {
  let ret = {
    dates: c.dates,
    regions: []
  };
  for (let i = 0; i < c.regions.length; ++i) {
    ret.regions[i] = Object.assign(
      {},
      c.regions[i],
      d.regions[i],
      r.regions[i]
    );
  }
  return ret;
}

async function run() {
  try {
    const cp = fetchFile(
      "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"
    );
    const dp = fetchFile(
      "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv"
    );
    const rp = fetchFile(
      "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv"
    );

    const cs = await cp;
    const ds = await dp;
    const rs = await rp;

    const c = csv2json(cs, { parseNumbers: true });
    const d = csv2json(ds, { parseNumbers: true });
    const r = csv2json(rs, { parseNumbers: true });

    const cc = consolidate(c, "confirmed");
    const dc = consolidate(d, "dead");
    const rc = consolidate(r, "recovered");

    const data = merge(cc, dc, rc);

    db.writeFile(PATH, JSON.stringify(data));

    console.log(`Updated ${PATH}`);
  } catch (error) {
    console.error(error);
  }
}

run();
