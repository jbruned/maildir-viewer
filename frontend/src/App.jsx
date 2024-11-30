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
        setLoggedIn(username)
    }).catch(() => {
        setLoggedIn(false)
    })

    return (
        loggedIn === null ? <LoadingScreen /> : (
            loggedIn ? <MainLayout appTitle={APP_TITLE} username={loggedIn} setUsername={setLoggedIn} />
                     : <Login appTitle={APP_TITLE} setLoggedIn={setLoggedIn} />
        )
    )
}

export default App
