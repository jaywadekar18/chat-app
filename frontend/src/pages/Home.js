import React, { useState } from 'react'
import Login from './Login'
import SignUp from './SignUp'
import styles from '../styles/home.module.css'
function Home() {
  const [isLogin, setIsLogin] = useState(true)
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