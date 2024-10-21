import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useFade } from '../hooks/useFade'; // Import the hook

const NewLogForm = () => {
   const [step, setStep] = useState(1);
   const [mood, setMood] = useState(3);
   const [sleepHours, setSleepHours] = useState(8);
   const [note, setNote] = useState('');
   const navigate = useNavigate();

   // Use the fade hook
   const { isVisible, shouldRender, fadeIn, fadeOut } = useFade(300);

   const nextStep = () => {
      fadeOut(() => {
         setStep((prevStep) => prevStep + 1);
         fadeIn();
      });
   };

   const prevStep = () => {
      fadeOut(() => {
         setStep((prevStep) => prevStep - 1);
         fadeIn();
      });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('token');

      try {
         const { data } = await axios.post(
            'https://u09-fullstack-js-lemonyblossom.onrender.com/logs',
            { mood, sleepHours, note },
            { headers: { Authorization: `Bearer ${token}` } }
         );
         console.log('Log created:', data);
         navigate('/logs');
      } catch (error) {
         console.error('Error saving log:', error);
      }
   };

   return (
      <div className="flex justify-center items-center h-screen md:max-h-[1200px]">
         <form
            onSubmit={handleSubmit}
            className="h-screen  w-screen max-w-[600px] flex flex-col items-center relative"
         >
            {/* label positioning */}
            {shouldRender && (
               <div
                  className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'} absolute top-10 w-screen text-xl font-bold text-center`}
               >
                  {step === 1 && 'How\'s your Mood?'}
                  {step === 2 && 'How Many Hours Did You Sleep?'}
                  {step === 3 && 'Note:'}
               </div>
            )}

            {/* Step 1: Mood */}
            {step === 1 && shouldRender && (
               <div
                  className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'} absolute inset-0 flex flex-col items-center justify-center`}
               >
                  <div className="flex flex-col items-center justify-center space-y-4">
                     {[1, 2, 3, 4, 5].map((value) => (
                        <button
                           key={value}
                           type="button"
                           onClick={() => setMood(value)}
                           className={`w-24 h-12 font-bold rounded-full flex items-center justify-center border ${mood === value ? 'bg-black text-white' : 'bg-gray-100 text-black'
                              }`}
                        >
                           {value}
                        </button>
                     ))}
                  </div>
               </div>
            )}

            {/* Step 2: Sleep Hours */}
            {step === 2 && shouldRender && (
               <div
                  className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'} absolute inset-0 flex flex-col items-center justify-center`}
               >
                  <div className="flex flex-col items-center justify-center space-y-4">
                     {[
                        { label: '0', value: 0 },
                        { label: '< 4 hours', value: 3 },
                        { label: '5 hours', value: 5 },
                        { label: '6 hours', value: 6 },
                        { label: '7 hours', value: 7 },
                        { label: '8 hours', value: 8 },
                        { label: '9 hours', value: 9 },
                        { label: '> 10 hours', value: 10 }
                     ].map(({ label, value }) => (
                        <button
                           key={value}
                           type="button"
                           onClick={() => setSleepHours(value)}
                           className={`w-24 h-12 rounded-full flex items-center justify-center border font-bold ${sleepHours === value ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}
                        >
                           {label}
                        </button>
                     ))}
                  </div>
               </div>
            )}

            {/* Step 3: Note */}
            {step === 3 && shouldRender && (
               <div
                  className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'} absolute inset-0 flex flex-col items-center justify-center`}
               >
                  <textarea
                     value={note}
                     onChange={(e) => setNote(e.target.value)}
                     className="w-screen max-w-[600px] h-[50vh] p-2 mb-4 border-2 border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                  />
               </div>
            )}

            {/* position fixed buttons */}
            <div className="fixed bottom-10 w-full flex justify-between px-24">
               {step === 1 && (
                  <>
                     <button
                        type="button"
                        onClick={() => navigate('/logs')}
                        className="bg-white text-black w-[6rem] max-w-[6rem] py-3 rounded-full shadow-lg hover:bg-black hover:text-white transition duration-300"
                     >
                        Logs
                     </button>
                     <button
                        type="button"
                        onClick={nextStep}
                        className="bg-white text-black w-[6rem] max-w-[6rem] py-3 rounded-full shadow-lg hover:bg-black hover:text-white transition duration-300"
                     >
                        Next
                     </button>
                  </>
               )}

               {step === 2 && (
                  <>
                     <button
                        type="button"
                        onClick={prevStep}
                        className="bg-white text-black w-[6rem] max-w-[6rem] py-3 rounded-full shadow-lg hover:bg-black hover:text-white transition duration-300"
                     >
                        Previous
                     </button>
                     <button
                        type="button"
                        onClick={nextStep}
                        className="bg-white text-black w-[6rem] max-w-[6rem] py-3 rounded-full shadow-lg hover:bg-black hover:text-white transition duration-300"
                     >
                        Next
                     </button>
                  </>
               )}

               {step === 3 && (
                  <>
                     <button
                        type="button"
                        onClick={prevStep}
                        className="bg-white text-black w-[6rem] max-w-[6rem] py-3 mt-4 rounded-full shadow-lg hover:bg-black hover:text-white transition duration-300"
                     >
                        Previous
                     </button>
                     <button
                        type="submit"
                        className="bg-white text-black font-semibold w-[6rem] max-w-[6rem] py-3 mt-4 rounded-full shadow-lg ring-2 ring-green-500 ring-inset hover:bg-black hover:ring-black hover:text-white transition duration-300"
                     >
                        Done
                     </button>
                  </>
               )}
            </div>
         </form>
      </div>
   );
};

export default NewLogForm;
