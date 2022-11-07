import React, { useEffect, useState } from 'react'
import { getValueFromLocalStorage } from '../services/localStorageService';
import { useNavigate, Route, Navigate } from 'react-router-dom';
import Chats from '../pages/Chats';

function PrivateRoute({ path, children }) {
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    console.log(path);

    let token = getValueFromLocalStorage('accessToken')

    console.log(token);
  console.log('====================================');
  console.log('ch',children);
  console.log('====================================');
    // useEffect(() => {

    //     if (getValueFromLocalStorage('accessToken').length > 0) {
    //         setIsLoggedIn(true)
    //     }
    //     else navigate('/home')

    // }, [getValueFromLocalStorage('accessToken')])

    return (
        <div>
            {
                token ? children : <Navigate to='/login' />
            }
        </div>
    )
}

export default PrivateRoute