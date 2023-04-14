# LinkedIn Jobs Web Crawler
As someone who has spent a considerable amount of time crawling LinkedIn for job postings, I wanted to make a job crawler to search through LinkedIn jobs (without needing a login), forming a DB which I can query to quick-apply to later. I wanted to gain experience with TypeScript, so using that with Node to form that backend (axios and cheerio's are the libraries used for the actual scraping), and will make DB and front-end decisions later (likely using TypeScript react for frontend, some SQL DB/mongo if I need something quick and easy)


### Notes
- LinkedIn uses infinite scrolling, when reaching the bottom of the page will issue a new GET request appending start=25 after the url
- Currently hardcoding in keywords, after I get backend up and running can then process different keywords that can connect to differnt DB collections?
