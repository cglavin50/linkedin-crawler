"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const dotenv = __importStar(require("dotenv"));
// establish global variables // 
dotenv.config({ path: '../../.env', });
const port = 8080; // append to .env later
const app = (0, express_1.default)();
const user = process.env.DB_USER;
const host = process.env.DB_HOST;
const db = process.env.DB_DATABASE;
const pswd = process.env.DB_PASSWORD;
const DBport = Number(process.env.DB_PORT);
const client = new pg_1.Client({
    user: user,
    host: host,
    database: db,
    password: pswd,
    port: DBport
});
// end globals // 
// Attributes: title, remote, link, location, company, companyPage, completed // expand later
function initDB() {
    client.connect().then(() => console.log('Connected to the DB'))
        .catch((err) => console.error('connection error to DB', err.stack));
    let createQuery = `
    CREATE TABLE IF NOT EXISTS "users" (
	    "id" SERIAL,
	    "title" VARCHAR(100) NOT NULL,
	    "company" VARCHAR(100) NOT NULL,
        "company-page" VARCHAR(200) NOT NULL,
        "link" VARCHAR(200) NOT NULL,
        "location" VARCHAR(100) NOT NULL,
        "completed" BOOLEAN NOT NULL,
        "remote" BOOLEAN NOT NULL,
	    PRIMARY KEY ("id")
    );`;
    client.query({
        text: createQuery
    }).then(() => console.log('Created table in DB'))
        .catch((err) => console.error('Error creating table', err.stack));
} // connects, and initializes the table if one does not exist for this user
// to do, add multiple user functionality later, need front-end for that
initDB();
