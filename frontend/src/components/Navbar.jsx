import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        // Decode the token's payload to get the user's role
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUserRole(decodedToken.role); // Set the role from token
      } catch (error) {
        console.error('Error decoding token:', error);
        setUserRole(null);
      }
    }
  }, []);

  if (location.pathname === '/add-log') {
    return null; // Hide navbar on the add-log page
  }

  return (
    /*  <nav className="navbar w-screen md:max-w-[600px] lg:[1200px]  shadow-lg fixed bottom-0 z-10 text-white">
       <div className=" bg-white/40 backdrop-blur-sm max-w-[600px] items-center mx-auto flex justify-around py-2 text-white text-sm font-semibold  md:text-base blur-sm ">
         <Link
           to="/logs"
           className="hover:scale-90 active:scale-110 transition duration-300"
         >
           Logs
         </Link>
         <Link
           to="/stats"
           className="hover:scale-90 active:scale-110 transition duration-300"
         >
           Stats
         </Link>
         <Link
           to="/add-log"
           className="ADD-LOG flex flex-col justify-center items-center text-xl hover:scale-150 hover:-translate-y-2 hover:bg-indigo-600/60 hover:border hover:border-indigo-200 w-9 h-9 rounded-full active:scale-110 transition-transform duration-300"
         >
           +
         </Link>
         <Link
           to="/profile"
           className="hover:scale-90 active:scale-110 transition duration-300"
         >
           Profile
         </Link>
         <Link
           to="/tools"
           className="hover:scale-90 active:scale-110 transition duration-300"
         >
           Tools
         </Link>
 
         {userRole === 'admin' && (
           <Link
             to="/admin"
             className="hover:scale-90 active:scale-110 transition duration-300"
           >
             Admin
           </Link>
         )}
       </div>
     </nav> */
    <nav className="navbar w-screen md:max-w-[600px] lg:max-w-[1200px] shadow-lg fixed bottom-0 z-10">
      <div className="bg-gradient-to-b from-white/40 to-indigo-700/40 backdrop-blur-md max-w-[600px] mx-auto flex justify-around py-2 font-bold text-base rounded-t-xl">
        {/* Link styles (no blur, crisp text) */}
        <Link
          to="/logs"
          className="hover:scale-90 active:scale-110 transition duration-300 text-white"
        >
          Logs
        </Link>
        <Link
          to="/stats"
          className="hover:scale-90 active:scale-110 transition duration-300 text-white"
        >
          Stats
        </Link>

        {/* Add Log Button */}
        <Link
          to="/add-log"
          className="ADD-LOG h-full text-[2rem] hover:scale-[1.3] duration-300 text-white"
        >
          +
        </Link>

        <Link
          to="/profile"
          className="hover:scale-90 active:scale-110 transition duration-300 text-white"
        >
          Profile
        </Link>
        <Link
          to="/tools"
          className="hover:scale-90 active:scale-110 transition duration-300 text-white"
        >
          Tools
        </Link>

        {userRole === 'admin' && (
          <Link
            to="/admin"
            className="hover:scale-90 active:scale-110 transition duration-300 text-white"
          >
            Admin
          </Link>
        )}
      </div>
    </nav>

  );
};

export default Navbar;
