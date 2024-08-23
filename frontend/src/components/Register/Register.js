import { useState } from 'react';
import axios from 'axios';
import './register.css';  // Import the CSS file

const Register = () => {
   const [username, setUsername] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
 
   const handleSubmit = async (e) => {
     e.preventDefault();
     
     try {
       const response = await axios.post('http://localhost:5001/register', {
         username,
         email,
         password,
       });
 
       console.log('User registered:', response.data);

       console.log('Registered Username:', username);
       console.log('Registered Email:', email);
     } catch (error) {
       console.error('There was an error registering!', error);
     }
   };
 
   return (
     <div className="register-container">
       <h2>Register</h2>
       <form onSubmit={handleSubmit}>
         <div>
           <label>Username:</label>
           <input
             type="text"
             value={username}
             onChange={(e) => setUsername(e.target.value)}
             required
           />
         </div>
         <div>
           <label>Email:</label>
           <input
             type="email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             required
           />
         </div>
         <div>
           <label>Password:</label>
           <input
             type="password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             required
           />
         </div>
         <button type="submit">Register</button>
       </form>
     </div>
   );
};
 
export default Register;
