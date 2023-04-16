import axios from 'axios'; // calling methods, don't need to instantiate axios object
import cheerio = require('cheerio');
// import html = require('cheerio/lib/static');

let url: string = 'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=software%20engineering%20intern&location=United%20StatesgeoId=103644278&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0&start=0';
// ^ basic URL for swe intern, page number means nothing. 0 <= startnumber <= 999

export type Job = { // had optional values, removing that functionality for now as that will add DB complications. Can expand here at a future point
    title: string;
    remote: boolean;
    link: string;
    location: string;
    company: string;
    companyPage: string;
}

export const parseJobs = (html: string): Job[] => { // takes in html string and returns Cheerio interface with cheerio elements
    const $:cheerio.CheerioAPI = cheerio.load(html);
    const jobsHTML: cheerio.Cheerio<cheerio.Element> = $('li'); // each job is a separate list item under linkedIn
    const jobs: Job[] = [];
    console.log(jobsHTML.length + ' jobs found');
    jobsHTML.each((index, element) => {
        var jobTitle:string = $(element).find('h3.base-search-card__title').text().trim();
        var company:string = $(element).find('h4.base-search-card__subtitle').text().trim();
        var companyPage:string|undefined = $(element).find('h4.base-search-card__subtitle').attr('href'); // attr's aren't guaranteed so can come out to undefined
        var location:string = $(element).find('span.job-search-card__location').text().trim();
        var link:string|undefined = $(element).find('a.base-card__full-link').attr('href');
        var remote: boolean = jobTitle.includes('Remote') ? true : false;
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
}

export const getJobs = (keywords: string[], location: string) => {
    // first, customize the url with keywords and location
    let url: string = 'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords='; // =software%20engineering%20intern&location=United%20States'
    let url2: string = '&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0&start=0';
    for (let i: number = 0; i < keywords.length; i++)
    {
        const word: string = keywords[i];
        const words:string[] = word.split(' ');
        url += words[0];
        for (let j: number = 1; j < words.length; j++)
        {
            url += "%20" + words[j];
        }
    } // end for to append keywords
    url += '&location=';
    const locations: string[] = location.split(' ');
    url += locations[0];
    for (let i: number = 1; i < locations.length; i++)
    {
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
    axios.get(url).then( response => {
        const html: string = response.data;
        const jobs: Job[] = parseJobs(html);
        console.log(jobs);
    })
}
// // fetch, then parse the jobs
// axios.get(url).then( response => {
//     const html: string = response.data;
//     const jobs: Job[] = parsejobs(html); // API provides interface to interact with basically array of list items
//     console.log(jobs);
// });