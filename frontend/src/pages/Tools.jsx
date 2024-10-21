import { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import '../styles/tools.css'


const Tools = () => {
   const [tools, setTools] = useState([]);
   const [searchQuery, setSearchQuery] = useState('');
   const [error, setError] = useState('');
   const [expandedTool, setExpandedTool] = useState(null);


   // Fetch tools by search query)
   const fetchTools = async (query = '') => {
      try {
         // If query, fetch filtered tools
         const url = query
            ? `https://u09-fullstack-js-lemonyblossom.onrender.com/tools/search?q=${query}`
            : 'https://u09-fullstack-js-lemonyblossom.onrender.com/tools';
         const response = await axios.get(url);

         if (Array.isArray(response.data)) {
            setTools(response.data);
         } else {
            setTools([]);
         }
      } catch (error) {
         setError('Error fetching tools');
         console.error(error);
         setTools([]);
      }
   };

   //fetch on query changes
   useEffect(() => {
      fetchTools(searchQuery);
   }, [searchQuery]);  //fetch all on mount and when query change

   const handleExpand = (toolId) => {
      setExpandedTool(expandedTool === toolId ? null : toolId);
   };

   return (
      <div>
         <h2>Therapy Tools</h2>

         {/* SearchBar*/}
         <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

         {error && <p>{error}</p>}

         {/* Render if tools is array */}
         <div className="tools-grid">
            {Array.isArray(tools) && tools.length > 0 ? (
               tools.map((tool) => (
                  <div key={tool._id} className="tool-card">
                     <h3>{tool.name}</h3>
                     <p>{tool.description}</p>

                     {expandedTool === tool._id && (
                        <div className="expanded-content">
                           <p>{tool.expandedDescription}</p>
                           {tool.link && (
                              <a href={tool.link} target="_blank" rel="noopener noreferrer">
                                 Learn More
                              </a>
                           )}
                        </div>
                     )}

                     <button onClick={() => handleExpand(tool._id)}>
                        {expandedTool === tool._id ? 'Hide' : 'Show'}
                     </button>
                  </div>
               ))
            ) : (
               <p>No tools available</p>
            )}
         </div>
      </div>
   );
};

export default Tools;
