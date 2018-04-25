"use strict";

const electron = require("electron");
const app = electron.remote.app;

const ver = app.getVersion();

document.addEventListener("DOMContentLoaded",() => {
    document.getElementById("version").innerText = "Version "+ver;
});
