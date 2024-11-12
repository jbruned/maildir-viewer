import React, { useState } from 'react'

export function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loggedIn, setLoggedIn] = useState(false)

    if (loggedIn) {
        return <p>Logged in</p>
    }

    return (
        <div className="login-container">
            <div className="login-form">
                <h1 className="text-center">Login</h1>
                <form onSubmit={event => {
                    event.preventDefault()
                    if (email === 'test@test' && password === 'test') {
                        setLoggedIn(true)
                    }
                    setError('Invalid email or password')
                }
                }>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" className="form-control" id="email" value={email} onChange={event => setEmail(event.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" id="password" value={password} onChange={event => setPassword(event.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                    <p className="text-danger">{error}</p>
                </form>
            </div>
        </div>
    )
}

export default Login
