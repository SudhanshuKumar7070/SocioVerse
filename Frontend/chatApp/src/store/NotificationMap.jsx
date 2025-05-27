import { useState } from 'react';
import { createContext } from 'react';
const contextMap = createContext(new Map);
 const MapProvider = ({ children }) => {
  const [globalMap] = useState(new Map()); // Keep the map persistent

  const setValue = (key, value) => {
    globalMap.set(key, value);
  };

  const getValue = (key) => globalMap.get(key);

  return (
    <contextMap.Provider value={{ globalMap, setValue, getValue }}>
      {children}
    </contextMap.Provider>
  );
};

export {contextMap ,MapProvider}