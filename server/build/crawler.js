"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios")); // calling methods, don't need to instantiate axios object
const cheerio = require("cheerio"); // using require as I will instantiate cheerio object
// import html = require('cheerio/lib/static');
let url = "https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=software%20engineering%20intern&location=United%20StatesgeoId=103644278&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0&start=0";
// ^ basic URL for swe intern, page number means nothing
let html = "";
// axios GET request
axios_1.default.get(url).then(response => {
    html = response.data;
    //  console.log(html);
});
// parse 
const $ = cheerio.load(html);
const jobs = $('li'); // get all list items from the html
console.log("Printing first job");
console.log(jobs[0]);
// iterate
jobs.each((index, element) => {
    const jobTitle = $(element).find('h3.base-search-card__title').text(); // get each element, then find the h3 header and output the text
    console.log(jobTitle);
});
