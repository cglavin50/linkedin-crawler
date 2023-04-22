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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crawler_1 = require("./crawler");
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const dotenv = __importStar(require("dotenv"));
// establish global variables // 
dotenv.config({ path: '../.env', }); // npm start has a different working directory than directly running, change to ../../.env if running from build directory
// console.log(process.env);
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
// hardcoding keywords for now
const keywords = ["software", "engineering", "intern"];
const location = "united states";
// end globals // 
// Attributes: title, remote, link, location, company, companyPage, completed // expand later
function initDB() {
    client.connect().then(() => console.log('Connected to the DB'))
        .catch((err) => console.error('connection error to DB', err.stack));
    let createQuery = `
    CREATE TABLE IF NOT EXISTS "tempJobsTable" (
	    "id" SERIAL,
	    "title" VARCHAR(100) NOT NULL,
	    "company" VARCHAR(100) NOT NULL,
        "company-page" VARCHAR(300) NULL,
        "link" VARCHAR(300) NOT NULL,
        "location" VARCHAR(100) NOT NULL,
        "completed" BOOLEAN NOT NULL,
        "remote" BOOLEAN NOT NULL,
	    PRIMARY KEY ("id")
    );`;
    client.query({
        text: createQuery
    }).then(() => console.log('Created table in DB (if dne)'))
        .catch((err) => console.error('Error creating table', err.stack));
    uploadSearch(); // upload jobs to table
} // connects, and initializes the table if one does not exist for this user
// to do, add multiple user functionality later, need front-end for that
function uploadSearch() {
    return __awaiter(this, void 0, void 0, function* () {
        const jobs = yield (0, crawler_1.getJobs)(keywords, location);
        if (jobs == null) {
            throw new Error("Error, jobs array null from getJobs");
        }
        console.log(jobs);
        //  const insertQuery: string = `INSERT INTO tempUserTable `
        for (let i = 0; i < jobs.length; i++) {
            const job = jobs[i];
            const query = `
        INSERT INTO "tempJobsTable" ("title", "company", "company-page", "link", "location", completed, remote)
        VALUES ('${job.title}', '${job.company}', '${job.companyPage}', '${job.link}', '${job.location}', FALSE, ${job.remote});
        `;
            console.log(query);
            client.query({
                text: query
            }).then(() => {
                console.log(`Inserted ${job.title} from ${job.company} into table`);
            })
                .catch((err) => console.error('Error inserting job record', err.stack));
        }
    });
}
initDB();
