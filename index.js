"use strict";
const debug = require("debug")("directoryWalker");
const fs = require("fs");
const path = require("path");

let files = [];
let _omitDuplicates = true;

function readTree(entry) {
  let stat = fs.statSync(entry);
  if (stat.isDirectory()) {
    fs.readdirSync(entry).forEach((file) => {
      readTree(path.join(entry, file));
    });
  } else {
    if (_omitDuplicates && !files.includes(entry)) {
      debug(`Adding: '${entry}'.`);
      files.push(entry);
    } else {
      debug(`Adding: '${entry}'.`);
      files.push(entry);
    }
  }
}

function SearchForEmptyDirectories(entry) {
  let stat = fs.statSync(entry);
  if (stat.isDirectory()) {
    debug(`Directory Found: ${entry}.`);
    const contents = fs.readdirSync(entry);
    if (contents.length === 0) {
      debug(`'entry' is EMPTY`);
      files.push(entry);
    } else {
      contents.forEach((file) => {
        SearchForEmptyDirectories(path.join(entry, file));
      });
    }
  }
}

module.exports = function (
  entry,
  omitDuplicates = true,
  emptyDirectory = false
) {
  if (typeof entry !== "string") {
    throw new Error(
      `Function's first parameter requires a resolved directory path.`
    );
  }
  if (typeof omitDuplicates !== "boolean") {
    throw new Error(`Function's second parameter must be a boolean value.`);
  }
  _omitDuplicates = omitDuplicates;
  if (typeof emptyDirectory !== "boolean") {
    throw new Error(`Function's third parameter must be a boolean value.`);
  }

  const entryStats = fs.statSync(entry);
  if (!entryStats.isDirectory()) {
    throw new Error(`Function's first parameter must be a directory.`);
  }

  debug(`Clearing file array and starting recursive directory index.`);
  debug(`Duplicate files are: ${omitDuplicates ? "omitted" : "included"}.`);
  files = [];

  if (emptyDirectory) {
    SearchForEmptyDirectories(entry);
    return files;
  } else {
    readTree(entry);
    return files;
  }
};
