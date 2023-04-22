"use strict";
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
exports.getJobs = exports.parseHTML = void 0;
const axios_1 = __importDefault(require("axios")); // calling methods, don't need to instantiate axios object
const cheerio = require("cheerio");
const parseHTML = (html) => {
    const $ = cheerio.load(html);
    const jobsHTML = $('li'); // each job is a separate list item under linkedIn
    const jobs = [];
    // console.log(jobsHTML.length + ' jobs found');
    jobsHTML.each((index, element) => {
        var jobTitle = $(element).find('h3.base-search-card__title').text().trim();
        var company = $(element).find('h4.base-search-card__subtitle').text().trim();
        var companyPage = $(element).find('h4.base-search-card__subtitle').attr('href'); // attr's aren't guaranteed so can come out to undefined
        var location = $(element).find('span.job-search-card__location').text().trim();
        var link = $(element).find('a.base-card__full-link').attr('href');
        var remote = jobTitle.includes('Remote') ? true : false;
        if (link == undefined) {
            link = '';
        }
        if (companyPage == undefined) {
            companyPage = '';
        }
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
exports.parseHTML = parseHTML;
const getJobs = (keywords, location) => __awaiter(void 0, void 0, void 0, function* () {
    // first, customize the url with keywords and location
    let url = 'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords='; // =software%20engineering%20intern&location=United%20States'
    let url2 = '&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0&start=0';
    var jobs = null;
    for (let i = 0; i < keywords.length; i++) {
        const word = keywords[i];
        const words = word.split(' ');
        url += words[0];
        for (let j = 1; j < words.length; j++) {
            url += "%20" + words[j];
        } // keyworkds[i] has been added
        url += "%20";
    } // end for to append keywords
    url += '&location=';
    const locations = location.split(' ');
    url += locations[0];
    for (let i = 1; i < locations.length; i++) {
        url += '%20' + locations[i];
    }
    url += url2;
    // fetch, then parse the jobs, each refresh will load [start, start+24]
    // for (let counter: number = 0; counter < 999; counter+=25)
    // {
    //     url = url.slice(0, -1);
    //     url += String(counter);
    //     console.log(url);
    //     axios.get(url).then( response => {
    //         const html: string = response.data;
    //         const jobs: Job[] = parseJobs(html); // API provides interface to interact with basically array of list items
    //         console.log(jobs);
    //     });
    // } // end for
    // // need to get results [976, 999], counter currently at 1000
    // url = url.slice(0, -1);
    // url += "976"
    // axios.get(url).then( response => {
    //     const html: string = response.data;
    //     const jobs: Job[] = parseJobs(html); // API provides interface to interact with basically array of list items
    //     console.log(jobs);
    // });
    // for now, just get once
    //    console.log(url); // URL is confirmed working
    const html = (yield axios_1.default.get(url)).data;
    return (0, exports.parseHTML)(html);
});
exports.getJobs = getJobs;
let words = ["mechanical", "engineering"];
let location = "united states";
(0, exports.getJobs)(words, location);
