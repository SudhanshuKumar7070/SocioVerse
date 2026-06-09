import React from 'react'
 import {io} from "socket.io-client" 
 import { useContext } from 'react';
 import { createContext } from 'react';
import { useMemo } from 'react';

      export const useSocket = ()=>{
        const [socket] = useContext(SocketContext);
        return socket;
      }
      export const useGlobalSocket = ()=>{
        const [, globalSocket] = useContext(SocketContext);
        return globalSocket;
      }
        const SocketContext =  createContext(null);
      export  const SocketProvider =({children})=>{
          const socket = useMemo(()=>io(`${import.meta.env.VITE_SOCKET_URL}/chat`),[]);
          const globalSocket =useMemo(()=>io(`${import.meta.env.VITE_SOCKET_URL}/global`),[]);
             return(
              <SocketContext.Provider value={[socket, globalSocket]}>
                     {children}

              </SocketContext.Provider>
             )
        }
  

