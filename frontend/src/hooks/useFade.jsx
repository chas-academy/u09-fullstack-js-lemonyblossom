import { useState } from 'react';

export const useFade = (duration = 300) => {
   const [isVisible, setIsVisible] = useState(true);
   const [shouldRender, setShouldRender] = useState(true);

   const fadeOut = (callback) => {
      setIsVisible(false);
      setTimeout(() => {
         setShouldRender(false);
         if (callback) callback();
      }, duration);
   };

   const fadeIn = () => {
      setIsVisible(true);
      setShouldRender(true);
   };

   return { isVisible, shouldRender, fadeIn, fadeOut };
};
