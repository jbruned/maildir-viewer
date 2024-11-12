import { useState } from 'react'
import './App.css'
import LoadingScreen from './components/LoadingScreen.jsx'
import Login from './components/Login.jsx'
import MainLayout from './components/MainLayout.jsx'
import { requestUsername } from './common/requests.jsx'

const APP_TITLE = 'Maildir Viewer'

function App() {
    const [loggedIn, setLoggedIn] = useState(null)

    requestUsername().then(username => {
        setLoggedIn(username.username)
    })

    return (
        loggedIn === null ? <LoadingScreen /> : (
            loggedIn ? <MainLayout appTitle={APP_TITLE} username={loggedIn} /> : <Login setLoggedIn={setLoggedIn} />
        )
    )
}

export default App
