# LinkedIn Jobs Web Crawler

As someone who has spent a considerable amount of time crawling LinkedIn for job postings, I wanted to make a job crawler to search through LinkedIn jobs (without needing a login), forming a DB which I can query to quick-apply to later. I wanted to gain experience with TypeScript, so using that with Node to form that backend (axios and cheerio's are the libraries used for the actual scraping), and will make DB and front-end decisions later (likely using TypeScript react for frontend, some SQL DB/mongo if I need something quick and easy)

## Goal

Create a web app where you can login with email, and create 'job searches'. With each search you can specify keywords, location, remote, etc, which will then send a request to the backend. The backend will scrape linkedin, and put the 1000 results in a DB. Then, each user can view their job searches, and click to get to a page where they can view their top 10 (get next 10 as they go), click complete application (mark as done), as well as see their completed applications.

## To Do List

**Backend**
- Link up to the DB after creation
- Build out endpoints (REST, need to change tsconfig start script as well)

**Frontend**
- Need to start with a basic page that can display the DB (forwarded from backend)
- Once I can view, then start building buttons for get next 10, completed application
- Then, work on a login system with AuthO authorization
- Finally, CSS :(

**DB**
- Start designing SQL DB, want sorting options later so that makes it easier (plus need more SQL experience)
- Using PostgreSQL as, in theory if this were to scale, there would be a relatively high number of writes as people mark their data as completed, search for more jobs, etc. Additionally, there wouldn't be a high read-load, as they come in batches and need minimal sorting. 
- Going to start with a local deployment, could like to use some sort of cloud offering later (switch isn't that hard)
- Attributes: title, remote, link, location, company, companyPage, completed. Maybe unique ID as well (could be hash of title+company). Also look into pay, date posted as attributes for future development
