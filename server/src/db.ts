import { Job, getJobs } from './crawler';
import express from 'express';
import { Client } from 'pg';
import * as dotenv from 'dotenv';

// establish global variables // 
dotenv.config({path: '../.env',});
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

export function initDB() {
    client.connect().then( () => console.log('Connected to the DB'))
    .catch((err) => console.error('connection error to DB', err.stack));

    let createQuery: string = `
    CREATE TABLE IF NOT EXISTS "tempJobsTable" (
	    "id" SERIAL,
	    "title" VARCHAR(100) NOT NULL,
	    "company" VARCHAR(100) NOT NULL,
        "company-page" VARCHAR(500) NULL,
        "link" VARCHAR(500) NOT NULL,
        "location" VARCHAR(100) NOT NULL,
        "completed" BOOLEAN NOT NULL,
        "remote" BOOLEAN NOT NULL,
	    PRIMARY KEY ("id")
    );`;
    client.query({
        text: createQuery
    }).then(() => console.log('Created table in DB (if dne)'))
    .catch((err) => console.error('Error creating table', err.stack));

    // uploadSearch(); // upload jobs to table
} // connects, and initializes the table if one does not exist for this user
// to do, add multiple user functionality later, need front-end for that

export async function uploadSearch(keywords: string[], location:string ) {
    const jobs: Job[]|null = await getJobs(keywords, location);
    if (jobs == null) {
        throw new Error("Error, jobs array null from getJobs")
    }
    console.log(jobs);
//  const insertQuery: string = `INSERT INTO tempUserTable `
    for (let i = 0; i < jobs.length; i++)
    {
        const job: Job = jobs[i];
        const query: string = `
        INSERT INTO "tempJobsTable" ("title", "company", "company-page", "link", "location", completed, remote)
        VALUES ('${job.title}', '${job.company}', '${job.companyPage}', '${job.link}', '${job.location}', FALSE, ${job.remote});
        `;
        console.log(query);
        client.query({
            text: query
        }).then( () => {
            console.log(`Inserted ${job.title} from ${job.company} into table`);
        })
        .catch((err) => console.error('Error inserting job record', err.stack));
    }
}