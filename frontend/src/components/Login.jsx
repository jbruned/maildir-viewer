import React, { useState } from 'react'
import { login } from '../common/requests'

export function Login({ setLoggedIn, appTitle }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)
    const [lastErrorMessage, setLastError] = useState('')
    const [loggingIn, setLoggingIn] = useState(false)

    function handleLogin() {
        if (loggingIn)
            return
        if (!email) {
            setError(true)
            setLastError('Please enter your email')
            return
        }
        if (!password) {
            setError(true)
            setLastError('Please enter your password')
            return
        }
        setLoggingIn(true)
        setError(false)
        login(email, password).then(() => {
            setLoggedIn(true)
            setLoggingIn(false)
        }).catch((message) => {
            setError(true)
            setLastError(message || 'An error occurred')
            setLoggingIn(false)
        })
    }

    return (
        <div className="login-container">
            <div className="login-widget">
                <h2 className='text-center'>{appTitle}</h2>
                <form onSubmit={event => {
                    event.preventDefault()
                    handleLogin()
                }}>
                    <div className="card action-buttons login-form m-0">
                        <div className="card-body">
                            <input type="text" className="form-control" id="email" value={email}
                                onChange={event => setEmail(event.target.value)} placeholder="Email" />
                            <input type="password" className="form-control" id="password" value={password}
                                onChange={event => setPassword(event.target.value)} placeholder="Password" />
                            <div className={`bg-danger text-light${error ? ' active' : ''}`} onClick={() => setError()}>
                                <i className="fas fa-exclamation-triangle"></i>
                                <p>{lastErrorMessage}</p>
                            </div>
                        </div>
                        <div className="card-footer">
                            <button type="submit" className="btn btn-primary p-2">
                                {loggingIn ? <span className="spinner-border spinner-border-sm" role="status"></span>
                                           : 'Login'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
