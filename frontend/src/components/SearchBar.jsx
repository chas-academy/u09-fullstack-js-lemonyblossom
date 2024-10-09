const SearchBar = ({ searchQuery, setSearchQuery }) => {
   return (
      <div>
         <input
            type="text"
            placeholder="Search by tool name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #ccc' }}
         />
      </div>
   );
};

export default SearchBar;
