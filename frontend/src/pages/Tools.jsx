import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Tools = () => {
   const [tools, setTools] = useState([]);
   const [error, setError] = useState('');

   useEffect(() => {
      const fetchTools = async () => {
         try {
            const response = await axios.get('http://localhost:5001/tools');
            setTools(response.data);
         } catch (error) {
            setError('Error fetching tools');
         }
      };

      fetchTools();
   }, []);

   return (
      <div>
         <h2>Available Tools</h2>
         {error && <p>{error}</p>}
         <ul>
            {tools.map((tool) => (
               <li key={tool._id}>
                  <h3>{tool.name}</h3>
                  <p>{tool.description}</p>
                  {tool.link && <a href={tool.link}>Learn More</a>}
               </li>
            ))}
         </ul>
      </div>
   );
};

export default Tools;
