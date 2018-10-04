#!/usr/bin/env node

'use strict';

const argv = process.argv.slice(2);
const [
    url,
    username,
    password,
] = argv;

if (!url)
    return console.log('shinju <url> <username> <password>');

const shinju = require('..');

shinju.connect(url, username, password);

