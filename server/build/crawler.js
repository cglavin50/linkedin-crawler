"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios")); // calling methods, don't need to instantiate axios object
const cheerio = require("cheerio");
// import html = require('cheerio/lib/static');
let url = 'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=software%20engineering%20intern&location=United%20StatesgeoId=103644278&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0&start=0';
const parsejobs = (html) => {
    const $ = cheerio.load(html);
    const jobsHTML = $('li'); // each job is a separate list item under linkedIn
    const jobs = [];
    console.log(jobsHTML.length + ' jobs found');
    jobsHTML.each((index, element) => {
        const jobTitle = $(element).find('h3.base-search-card__title').text().trim();
        const company = $(element).find('h4.base-search-card__subtitle').text().trim();
        const companyPage = $(element).find('h4.base-search-card__subtitle').attr('href'); // attr's aren't guaranteed so can come out to undefined
        const location = $(element).find('span.job-search-card__location').text().trim();
        const link = $(element).find('a.base-card__full-link').attr('href');
        const remote = jobTitle.includes('Remote') ? true : false;
        jobs.push({
            title: jobTitle,
            link: link,
            location: location,
            company: company,
            remote: remote,
            companyPage: companyPage,
        });
    });
    return jobs;
};
// fetch, then parse the jobs
axios_1.default.get(url).then(response => {
    const html = response.data;
    const jobs = parsejobs(html); // API provides interface to interact with basically array of list items
    console.log(jobs);
});
const getJobs = (keywords, location) => {
    // first, customize the url with keywords and location
    let url = 'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords='; // =software%20engineering%20intern&location=United%20States'
    let url2 = '&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0&start=0';
    for (let i = 0; i < keywords.length; i++) {
        const word = keywords[i];
        const words = word.split(' ');
        url += words[0];
        for (let j = 1; j < words.length; j++) {
            url += "%20" + words[j];
        }
    } // end for to append keywords
    url += '&location=';
    const locations = location.split(' ');
    url += locations[0];
    for (let i = 1; i < locations.length; i++) {
        url += '%20' + locations[i];
    }
    url += url2;
    // fetch, then parse the jobs
    axios_1.default.get(url).then(response => {
        const html = response.data;
        const jobs = parsejobs(html); // API provides interface to interact with basically array of list items
        console.log(jobs);
    });
};
