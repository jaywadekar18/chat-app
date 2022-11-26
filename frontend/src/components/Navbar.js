import React, { useState } from 'react'
import axiosClient from '../services/axiosService';
import styles from '../styles/navbar.module.css'
import { getValueFromLocalStorage, addValueInLocalStorage ,deleteValueFromLocalStorage } from '../services/localStorageService'
import {useNavigate ,Link} from 'react-router-dom'
function Navbar() {
const navigate =useNavigate()

  function logOutUser() {
    deleteValueFromLocalStorage('userId');
    deleteValueFromLocalStorage('accessToken');
    navigate('/home')
  }

  return (
    <nav>
      <header>Chat App</header>
      <div style={{ textAlign: 'right' }}>
      <Link to='/home'>
        <span className={styles.navLinks}>Login</span></Link>
        <span className={styles.navLinks}>Profile</span>
        <span className={styles.navLinks} onClick={logOutUser}>Logout</span>
      </div>
      {/* <input/>
    <input type='checkbox' /> */}
    </nav>
  )
}

export default Navbar