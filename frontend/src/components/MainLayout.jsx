import React, { useEffect, useState } from 'react'
import { MessageList } from './MessageList.jsx'
import { MessageView } from './MessageView.jsx'
import { requestFolders, requestMessages } from '../common/requests.jsx'
import LoadingScreen from './LoadingScreen.jsx'

function isMessage(data) {
    return data && !Array.isArray(data)
}

function MainLayout({ appTitle, username }) {
    const [data, setData] = useState(null)
    const [selectedMessages, setSelectedMessages] = useState([])
    const [folders, setFolders] = useState(null)
    const [currPath, setPath] = useState('/')

    requestFolders().then(folders => {
        setFolders(folders)
    })

    var lastPromise = null

    // Every time the URL changes, reload the messages
    useEffect(() => {
        console.log('Path changed:', currPath)
        lastPromise = requestMessages(currPath)
        const currentPromise = lastPromise
        lastPromise.then(messages => {
            if (currentPromise !== lastPromise) {
                return
            }
            setData(messages)
        })
    }, [currPath])

    function navigateTo(path) {
        window.history.pushState({}, '', path)
        setData(null)
        setPath(path)
    }

    function handleOpenMessage(message) {
        navigateTo(`/message/${message.id}`)
    }

    function handleSelectMessage(message, checked) {
        setSelectedMessages((selectedMessages) => {
            if (checked) {
                return [...selectedMessages, message.id]
            }
            return selectedMessages.filter(id => id !== message.id)
        })
    }

    function handleSelectFolder(folder) {
        setSelectedFolder(folder)
    }

    return (
        <>
            <div className="top-bar">
                <button id="sidebarToggle" className="btn btn-link text-white d-md-none"
                        onClick={() => document.querySelector('.sidebar').classList.toggle('active')}>
                    <i className="fas fa-bars"></i>
                </button>
                <div className="top-bar-title">{appTitle}</div>
                <div className="search-container">
                    <input type="text" className="form-control search-bar d-none d-md-block" placeholder="Search..."
                            onBlur={() => document.querySelector('.top-bar').classList.remove('search-active')} />
                    <a className="btn btn-link text-light d-block d-md-none" onClick={() => {
                        document.querySelector('.top-bar').classList.toggle('search-active')
                        document.querySelector('.search-bar').focus()
                    }}>
                        <i className="fas fa-search"></i>
                    </a>
                </div>
                <div className="logout-icon-container">
                    <span id="username-display" className="mr-2">{username}</span>
                    <i className="fas fa-sign-out-alt logout-icon"></i>
                </div>
            </div>

            <div className="main-container">
                <nav className="sidebar">
                    <div className={`message-actions ${selectedMessages.length > 0 || isMessage(data) ? 'active' : ''}`}>
                        <div className="card">
                            <div className="card-body">
                                <p className="card-text">{
                                    isMessage(data) ? 'Current message' :
                                    `${selectedMessages.length} message${selectedMessages.length > 1 ? 's' : ''} selected`
                                }</p>
                            </div>
                            <div className="card-footer">
                                <a className="btn btn-primary"><i className="fas fa-download"></i></a>
                                <a className="btn btn-danger"><i className="fas fa-trash"></i></a>
                            </div>
                        </div>
                    </div>
                    {/* <ul className="folder-list list-unstyled">
                <li><a href="#" className="active">Inbox</a></li>
                <li><a href="#">Sent</a></li>
                <li><a href="#">Drafts</a></li>
                <li><a href="#">Trash</a></li>
                <li>
                  <a href="#">Projects</a>
                  <ul className="list-unstyled">
                    <li><a href="#" className="nested-folder">Project Alpha</a></li>
                    <li><a href="#" className="nested-folder">Project Beta</a></li>
                  </ul>
                </li>
              </ul> */}
                    <ul className="folder-list list-unstyled">
                        {folders === null ? (
                            <LoadingScreen />
                        ) : (
                            Object.keys(folders).map(folder => {
                                if (typeof folders[folder] === 'object') {
                                    return (
                                        <li key={folder}>
                                            <a href="#">{folder}</a>
                                            <ul className="list-unstyled">
                                                {Object.keys(folders[folder]).map(subfolder => (
                                                    <li key={subfolder} className="nested-folder"><a href="#">{subfolder}</a></li>
                                                ))}
                                            </ul>
                                        </li>
                                    )
                                }
                                return <li key={folder}><a href="#">{folder}</a></li>
                            })
                        )}
                    </ul>
                </nav>

                <div className="main-content">
                    {data === null ? (
                        <LoadingScreen />
                    ) : isMessage(data) ? (
                        <MessageView message={data} navigateTo={navigateTo} />
                    ) : (
                        <MessageList messages={data}
                            selectedMessages={selectedMessages}
                            onSelectMessage={handleSelectMessage}
                            onOpenMessage={handleOpenMessage} />
                    )}
                </div>
            </div>
        </>
    )
}

export default MainLayout
