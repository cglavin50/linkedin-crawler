import { Job, getJobs } from './crawler';
import express from 'express';
import { Client } from 'pg';
import * as dotenv from 'dotenv';
import {initDB } from './db'

// establish global variables // 
dotenv.config({path: '../.env',}); // npm start has a different working directory than directly running, change to ../../.env if running from build directory
// console.log(process.env);
const port: number = 8080; // append to .env later
const app = express();
// hardcoding keywords for now
const keywords: string[] = ["software", "engineering", "intern"];
const location: string = "united states";
// end globals // 
// Attributes: title, remote, link, location, company, companyPage, completed // expand later


initDB();