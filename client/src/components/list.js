import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import axis from 'axios';
import {GETSHORTENURL} from '../constant';
const PageComponent = () =>
{
const [Domain, setDomain] = useState('')
const [Result, setResult] = useState([{}]);
useEffect(() => {
  axis.get(GETSHORTENURL)
  .then(res=>{

      setResult(res.data.data);
      setDomain(res.data.domain);
      
  })
  return () => {
    setResult([{}])
  }
}, [])
  
return (
<div id="datapanel">
<Link to="/">Home</Link>
<h1>Analytics</h1>
 {Result.map(prod =>(
<div id="drow" key={Math.random(1500)}>
<p>
        <strong>
          {prod.url}
        </strong>
        </p>
        <p>
         {Domain}{prod.segment}
        </p>
        <p>
          Total Clicks:{prod.num_of_clicks}
          </p>
        <p>
          
          Top Countries:{prod.country?prod.country:'N/A'}
          
          </p>
<hr />   
</div>

 ))}
        </div>

  )

};

export default PageComponent; 