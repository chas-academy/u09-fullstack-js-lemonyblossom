import { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';

const Tools = () => {
   const [tools, setTools] = useState([]);
   const [searchQuery, setSearchQuery] = useState('');
   const [error, setError] = useState('');
   const [expandedTool, setExpandedTool] = useState(null);

   // Fetch tools (filtered by search query)
   const fetchTools = async (query = '') => {
      try {
         // If query, fetch filtered 
         const url = query ? `http://localhost:3000/tools/search?q=${query}` : 'http://localhost:5001/tools';
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

   // Fetch all on mount
   useEffect(() => {
      fetchTools(); // all on init
   }, []);

   // on searchQuery change
   useEffect(() => {
      if (searchQuery) {
         fetchTools(searchQuery); //
      } else {
         fetchTools();
      }
   }, [searchQuery]);

   const handleExpand = (toolId) => {
      setExpandedTool(expandedTool === toolId ? null : toolId);
   };

   return (
      <div>
         <h2>Therapy Tools</h2>

         {/* SearchBar component to handle search input */}
         <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

         {error && <p>{error}</p>}

         {/* Render tools only if tools is array */}
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
                        {expandedTool === tool._id ? 'Show Less' : 'Show More'}
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
