
import React, { useState, useEffect } from 'react'
import axiosClient from '../services/axiosService';
import styles from '../styles/login.module.css'
import { addValueInLocalStorage} from '../services/localStorageService'
import {useNavigate} from 'react-router-dom'

function Login() {
    const navigate =useNavigate()
    const [form, setForm] = useState({
        email: '',
        password: '',
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

        if (form.email.length === 0) {
            errors.email = 'Email is required!'
        }
        if (form.password.length === 0) {
            errors.password = 'Password is required!'
        }
        setFormError(errors)
    }
    async function handleSubmit(e) {
        try {
            handleError()
            console.log(Object.keys(formError).length !== 0)
            if (Object.keys(formError).length !== 0) {
                return;
            }
            let res = await axiosClient.post('user/login', form);
            console.log(res)
            if (res?.data) {
                addValueInLocalStorage('userId', res?.data?.userId);
                addValueInLocalStorage('accessToken', res?.data?.accessToken);
                navigate("/chats")
            }
        }
        catch (err) {
            console.log('====================================');
            console.log(err);
            console.log('====================================');
        }

    }
    return (
        <div className={styles.formContainer}>
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

            <button className={styles.submitButton} onClick={() => handleSubmit()}>Login</button>
        </div>
    )
}

export default Login