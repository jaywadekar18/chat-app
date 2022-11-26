import React, { useState, useEffect } from 'react'
import styles from '../styles/login.module.css'
import { addValueInLocalStorage} from '../services/localStorageService'
import axiosClient from '../services/axiosService';
import {useNavigate} from 'react-router-dom'
function SignUp() {
    const navigate =useNavigate()
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [formError, setFormError] = useState({});
    
    function handleChange(e) {
        let name = e.target.name
        let value = e.target.value
        setForm(prevValues => {
            return {
                ...prevValues, [name]: value
            }
        })
    }
    function handleError() {
        let errors = {}
        if (form.name.length === 0) {
            errors.name = 'Name is required!'
        }
        if (form.email.length === 0) {
            errors.email = 'Email is required!'
        }
        if (form.password.length === 0) {
            errors.password = 'Password is required!'
        }
        if (form.confirmPassword.length === 0) {
            errors.confirmPassword = 'Please confirm password!!'
        }
        if (form.confirmPassword !== form.password) {
            errors.confirmPassword = "Both password's should be same!!"
        }
        setFormError(errors)
    }
    async function handleSubmit() {
        handleError()
        console.log(formError);
        console.log(Object.keys(formError).length !== 0)
            if (Object.keys(formError).length !== 0) {
                return;
            }
            let res = await axiosClient.post('user', form);
            console.log(res)
            if (res?.data) {
                addValueInLocalStorage('userId', res?.data?.userId);
                addValueInLocalStorage('accessToken', res?.data?.accessToken);
                navigate("/chats")
            }

    }
    return (
        <div className={styles.formContainer}>
            <label htmlFor="name">Name*</label>
            <input id='name' type="text" name='name' value={form.name}
                style={{ borderColor: formError?.name ? 'red' : 'grey' }}
                onChange={handleChange} placeholder="Enter name..." />
            <p className={styles.errorMsg}>{formError?.name}</p>

            <label htmlFor="email">Email*</label>
            <input id='email' type="email" name='email'
                value={form.email}
                style={{ borderColor: formError?.email ? 'red' : 'grey' }}
                onChange={handleChange} placeholder="Enter email..." />
            <p className={styles.errorMsg}>{formError?.email}</p>

            <label htmlFor="password">Password*</label>
            <input id='password' type="password" name='password'
                value={form.password}
                style={{ borderColor: formError?.password ? 'red' : 'grey' }}
                onChange={handleChange} placeholder="Enter password..." />
            <p className={styles.errorMsg}>{formError?.password}</p>

            <label htmlFor="confirmPassword">Confirm Password*</label>
            <input id="confirmPassword" type="password" name='confirmPassword'
                value={form.confirmPassword}
                style={{ borderColor: formError?.confirmPassword ? 'red' : 'grey' }}
                onChange={handleChange} placeholder="Enter password again..." />
            <p className={styles.errorMsg}>{formError?.confirmPassword}</p>

            <button className={styles.submitButton} onClick={() => handleSubmit()}>Sign up</button>
        </div>
    )
}

export default SignUp