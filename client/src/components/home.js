import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { CREATESHORTENURL } from '../constant';
const HomePage = () => {
  const [url, seturl] = useState('');
  const [data, setdata] = useState({});
  const  performAction = () => {
  
  if(url==='') return;
  let apiurl=CREATESHORTENURL.replace("{inputURL}",encodeURIComponent(url));
   axios.get(apiurl)
    .then(res =>{
      if(res.data.statusCode===100)
      {
        setdata({"shorturl":res.data.url})
      }
    })
    }
    
  const ResultComponent =(props) => props.data.shorturl?<div id="result"><p>Here's Your Short URL</p><p>{props.data.shorturl}</p></div>:'';
  
  
    return( 
    <div id="home">
    <div>Welcome to short.com</div>
    <p>Please enter URL here</p>
    <p><input type="URL" required="true" name="orgurl" id="orgurl" onChange={(e)=>{
      seturl(e.target.value);
      setdata({});
      }} />&nbsp;<button onClick={performAction}>SHORTEN</button></p>
    <ResultComponent data={data} />
    <Link to="/stats">Stats</Link>
    </div>
    )
    };
    export default HomePage;