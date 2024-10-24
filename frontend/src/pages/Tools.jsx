import { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import loaderIcon from '../../src/loading.png';

const Tools = () => {
   const [tools, setTools] = useState([]);
   const [searchQuery, setSearchQuery] = useState('');
   const [error, setError] = useState('');
   const [expandedTool, setExpandedTool] = useState(null);
   const [loading, setLoading] = useState(false);

   // Fetch tools by search query
   const fetchTools = async (query = '') => {
      setLoading(true);
      setError('');
      try {
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
         setError('No match for tools');
         console.error(error);
         setTools([]);
      } finally {
         setLoading(false); // Ensure loading stops
      }
   };

   // Fetch on query changes
   useEffect(() => {
      fetchTools(searchQuery);
   }, [searchQuery]);

   const handleExpand = (toolId) => {
      setExpandedTool(expandedTool === toolId ? null : toolId);
   };

   return (
      <div className="ToolsPage flex flex-col items-center justify-start min-h-screen w-screen md:max-w-[600px] lg:max-w-[800px] py-10 scrollbar-none">
         <h2 className="text-4xl text-white font-bold mb-8">Therapy Tools</h2>

         {/* SearchBar */}
         <div className="w-full flex justify-center max-w-lg mb-8">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
         </div>

         {error && <p className="text-red-500">{error}</p>}

         {/* Conditionally show loader or tools */}
         {loading ? (
            <div className="relative flex items-center justify-center w-36 h-36 rounded-full animate-spinSlow">
               <img src={loaderIcon} alt="Loading..." className="absolute w-24 h-24" />
            </div>
         ) : (
            <div className="tools-grid w-full max-w-lg space-y-6">
               {Array.isArray(tools) && tools.length > 0 ? (
                  tools.map((tool, index) => (
                     <div
                        key={tool._id}
                        onClick={() => handleExpand(tool._id)}
                        className="tool-card bg-white/80 p-6 rounded-xl shadow-lg transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-xl cursor-pointer"
                        style={{
                           opacity: 0,
                           transform: 'translateY(20px)',
                           animation: `fadeInUp 0.5s ease-in-out forwards`,
                           animationDelay: `${index * 0.2}s`
                        }}
                     >
                        <h3 className="text-2xl font-semibold mb-2 text-gray-900">{tool.name}</h3>
                        <p className="text-gray-800">{tool.description}</p>

                        <div
                           className={`expanded-content mt-4 transition-all duration-500 ease-in-out overflow-hidden ${expandedTool === tool._id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                           <p className="text-gray-700">{tool.expandedDescription}</p>
                           {tool.link && (
                              <a
                                 href={tool.link}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="text-indigo-600 hover:text-indigo-800 mt-2 block"
                              >
                                 Learn More
                              </a>
                           )}
                        </div>

                        {/* Visual cue that there's more to read */}
                        <div className="text-indigo-600 mt-4 text-center transition-transform duration-300">
                           {expandedTool === tool._id ? '▲ Hide Details' : '▼ Read More'}
                        </div>
                     </div>
                  ))
               ) : (
                  <p className="text-center text-gray-200">Try another word</p>
               )}
            </div>
         )}
      </div>
   );
};

export default Tools;
