import React, { useState ,useEffect } from 'react'
import Login from './Login'
import SignUp from './SignUp'
import styles from '../styles/home.module.css'
import { getValueFromLocalStorage } from '../services/localStorageService';
import { useNavigate } from 'react-router-dom'
function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate()
  useEffect(() => {
    let loggedInUser = getValueFromLocalStorage('userId');
    if (loggedInUser) navigate('/chats')
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.toggleButtonContainer}>
          <button onClick={() => setIsLogin(true)}>login</button>
          <button onClick={() => setIsLogin(false)}>Signup</button>
        </div>


        {
          isLogin ? <Login /> : <SignUp />
        }

      </div>
    </div>
  )
}

export default Home