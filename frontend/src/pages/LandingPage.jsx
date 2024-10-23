import { Link } from 'react-router-dom';

const LandingPage = () => {
   return (
      <div className="flex flex-col items-center justify-center h-screen text-white py-10 px-4">
         {/* Title with entrance animation */}
         <h1 className="text-6xl font-bold mb-8 animate-fadeInUp opacity-0 animation-delay-1">
            Feelstate
         </h1>

         {/* Description with fade-in animation */}
         <p className="text-xl text-center mb-12 max-w-2xl animate-fadeInUp opacity-0 animation-delay-2">
            Welcome to Feelstate! Our mission is to help you track and manage your emotions through innovative tools like journaling, mindfulness exercises, and much more.
            Whether you're aiming for improved mental well-being or simply want to keep track of your daily mood, Feelstate is here to support you on that journey.
         </p>

         {/* Image Link with hover and scale effect */}
         <div className="flex flex-col items-center space-y-4">
            <Link to="/tools">
               <div className="relative group">
                  <img
                     src="https://via.placeholder.com/400x300" // Replace with an actual image URL
                     alt="Explore Tools"
                     className="w-96 h-64 object-cover rounded-xl shadow-lg transform transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-2xl"
                  />
                  {/* Overlay effect */}
                  <div className="absolute inset-0 bg-black bg-opacity-30 rounded-xl opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />
               </div>
            </Link>
            <p className="text-gray-300 text-lg animate-fadeInUp opacity-0 animation-delay-3">
               Click the image to explore our tools!
            </p>
         </div>
         <div className="flex flex-col items-center space-y-4">
            <Link to="/tools">
               <div className="relative group">
                  <img
                     src="https://via.placeholder.com/400x300" // Replace with an actual image URL
                     alt="Explore Tools"
                     className="w-96 h-64 object-cover rounded-xl shadow-lg transform transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-2xl"
                  />
                  {/* Overlay effect */}
                  <div className="absolute inset-0 bg-black bg-opacity-30 rounded-xl opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />
               </div>
            </Link>
            <p className="text-gray-300 text-lg animate-fadeInUp opacity-0 animation-delay-3">
               Click the image to explore our tools!
            </p>
         </div>
         <div className="flex flex-col items-center space-y-4">
            <Link to="/tools">
               <div className="relative group">
                  <img
                     src="https://via.placeholder.com/400x300" // Replace with an actual image URL
                     alt="Explore Tools"
                     className="w-96 h-64 object-cover rounded-xl shadow-lg transform transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-2xl"
                  />
                  {/* Overlay effect */}
                  <div className="absolute inset-0 bg-black bg-opacity-30 rounded-xl opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />
               </div>
            </Link>
            <p className="text-gray-300 text-lg animate-fadeInUp opacity-0 animation-delay-3">
               Click the image to explore our tools!
            </p>
         </div>
      </div>
   );
};

export default LandingPage;
