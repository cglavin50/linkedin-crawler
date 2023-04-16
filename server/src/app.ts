import { Job, parseJobs, getJobs } from './crawler';
import express from 'express';
import { Client } from 'pg';
import * as dotenv from 'dotenv';

// establish global variables // 
dotenv.config({path: '../../.env',});
const port: number = 8080; // append to .env later
const app = express();
const user: string|undefined = process.env.DB_USER;
const host: string|undefined = process.env.DB_HOST;
const db: string|undefined = process.env.DB_DATABASE;
const pswd: string|undefined = process.env.DB_PASSWORD;
const DBport: number|undefined = Number(process.env.DB_PORT);
const client: Client = new Client({
    user: user,
    host: host,
    database: db,
    password: pswd,
    port: DBport
})
// end globals // 

// Attributes: title, remote, link, location, company, companyPage, completed // expand later

function initDB() {
    client.connect().then( () => console.log('Connected to the DB'))
    .catch((err) => console.error('connection error to DB', err.stack));

    let createQuery: string = `
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