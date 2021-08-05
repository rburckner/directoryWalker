"use strict";
const debug = require("debug")("directoryWalker");
const fs = require("fs");
const path = require("path");

let files = [];
let omitDuplicates = true;

function readTree(entry) {
  let stat = fs.statSync(entry);
  if (stat.isDirectory()) {
    fs.readdirSync(entry).forEach((file) => {
      readTree(path.join(entry, file));
    });
  } else {
    if (omitDuplicates && !files.includes(entry)) {
      debug(`Adding: '${entry}'.`);
      files.push(entry);
    } else {
      debug(`Adding: '${entry}'.`);
      files.push(entry);
    }
  }
}

module.exports = function (entry, omitDuplicates = true) {
  if (typeof entry !== "string") {
    throw new Error(
      `Function's first parameter requires a resolved directory path.`
    );
  }
  if (typeof omitDuplicates !== "boolean") {
    throw new Error(`Function's second parameter must be a boolean value.`);
  }

  const entryStats = fs.statSync(entry);
  if (!entryStats.isDirectory()) {
    throw new Error(`Function's first parameter must be a directory.`);
  }

  debug(`Clearing file array and starting recursive directory index.`);
  debug(`Duplicate files are: ${omitDuplicates ? "omitted" : "included"}.`);
  files = [];
  readTree(entry);
  return files;
};
