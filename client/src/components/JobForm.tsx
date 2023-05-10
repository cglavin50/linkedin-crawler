import { useState } from 'react'
import axios from 'axios';
/*
  First step: create a basic form that on submit sends the query to the backend
  Second: after backend gets the request, be able to handle and present the response back (let's say show 5 for now)
  Third: After getting the above functionality, this should just present a user dashboard with links to take the user to a new page to view all searches, and to expand upon one (decide if I want this to be multi-paged)
*/

export function JobForm() {
    const [input, setInput] = useState({
      keywords: "",
      location: ""
    });
  
    const handleChange = (e: { preventDefault: () => void; target: { value: any; name: any; }; }) => { // need to fix typing of event e
      e.preventDefault();
      const value = e.target.value;
      setInput({
        ...input, // use this as each form is a single state object (with keywords and location), so need to append to the existing state
        [e.target.name]: value // get the name of the attribute, and append the value to input
      })
    }
  
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
      e.preventDefault(); // cancel refresh
      // send to backend
      const params = { // serial ID is handled via backend, just need to get keywords and location to make the search
        Keywords: input.keywords,
        Location: input.location
      };
      const searchParams = new URLSearchParams(params);
      const response = await axios.post("localhost" + "/api/search", 
        searchParams.toString(),
        {headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }});
      console.log("Response:");
      console.log(response);
      // reset input
      setInput({
        keywords: "",
        location: ""
      })
    }
  
    // following https://www.pluralsight.com/guides/handling-multiple-inputs-with-single-onchange-handler-react
    return (
      <form className="JobForm" onSubmit = {handleSubmit}>
        <label>
          Keywords
          <textarea name="keywords" value={input.keywords} onChange={handleChange} />
        </label>
        <label>
          Location
          <textarea name="location" value={input.location} onChange={handleChange} />
        </label>
      </form>
    )
      
}