"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signale_1 = require("signale");
const LoadRouter_1 = require("./event/LoadRouter");
const SensorRouter_1 = require("./sensor/infrastructure/SensorRouter");
const app = (0, express_1.default)();
const signale = new signale_1.Signale();
app.use(express_1.default.json());
app.use("/sensores", SensorRouter_1.sensorRouter);
app.use("/load", LoadRouter_1.loadRouter);
app.listen(3003, () => {
    signale.success("Server online in port 3003");
});
