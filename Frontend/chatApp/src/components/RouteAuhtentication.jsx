import React from 'react'
import { useSelector } from 'react-redux'
import { useEffect ,useState} from 'react';
import { useNavigate } from 'react-router-dom';
import SpinnerWithText from './LoadingSpinner';
function RouteAuhtentication({reqAuthentication= true , children}) {
    const [loading, setLoading] = useState(true);
    const isUserAuthenticated = useSelector((state)=>state.auth.isAuthenticated);
    const navigate = useNavigate()
    useEffect(()=>{
        const checkRouteAuthentication= ()=>{
            if( reqAuthentication && isUserAuthenticated !==reqAuthentication ){
                navigate("/login");
              }
              else if(!reqAuthentication && isUserAuthenticated !== reqAuthentication){
                navigate("/");
              }
              setLoading(false);
        }
        checkRouteAuthentication();
      
    },[isUserAuthenticated,navigate,reqAuthentication])

    if (loading) {
        return (
            <>
            <h1><SpinnerWithText/>Loading data...</h1>;
            </>
        )
      }
    
  return (
    <div>
        {children}
    </div>
  )
}

export default RouteAuhtentication
