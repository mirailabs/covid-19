const fs = require("fs");
const csv2json = require("csvjson-csv2json");
const json2csv = require("csvjson-json2csv");
const util = require("./util");

const ROOT_DIR = "data";

exports.set = function(doc, id, record) {
  const file = `${util.getTimestamp(new Date())}.csv`;
  const dir = `${ROOT_DIR}/${doc}`;
  const path = `${dir}/${file}`;

  let json;
  try {
    const csv = fs.readFileSync(path, { encoding: "utf8" });
    json = csv2json(csv, { parseNumbers: true });
  } catch (error) {
    // assume file does not exist
    console.warn(`Could not find '${path}' - is this the first write?`, error);
  }

  if (json) {
    prevRecord = json.find(r => r.State === id);
    if (prevRecord) {
      Object.assign(prevRecord, record);
    } else {
      json.push(record);
    }
  } else {
    json = [record];
  }

  const csv = json2csv(json);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path, csv);
};
