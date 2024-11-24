import React, { useEffect, useState } from 'react'
import { MessageList } from './MessageList.jsx'
import { MessageView } from './MessageView.jsx'
import { FolderList } from './FolderList.jsx'
import { deleteMessages, requestFolders, requestMessages } from '../common/requests.jsx'
import LoadingScreen from './LoadingScreen.jsx'

function isMessage(data) {
    return data && !Array.isArray(data)
}

function MainLayout({ appTitle, username }) {
    const [data, setData] = useState(null)
    const [selectedMessages, setSelectedMessages] = useState([])
    const [folders, setFolders] = useState(null)
    const [currPath, setPath] = useState(null)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const DEFAULT_FOLDER = 'Inbox'

    requestFolders().then(folders => {
        setFolders(folders)
    })

    var lastPromise = null

    // Every time the URL changes, reload the messages
    useEffect(() => {
        if (currPath === null) {
            const path = window.location.pathname
            if (path === '/') {
                navigateTo(`/${DEFAULT_FOLDER}`)
            } else {
                setPath(window.location.pathname)
            }
            return
        }
        if (deleting) {
            return
        }
        setData(null)
        lastPromise = requestMessages(currPath)
        const currentPromise = lastPromise
        lastPromise.then(messages => {
            if (currentPromise !== lastPromise) {
                return
            }
            setData(messages)
        })
    }, [currPath, deleting])

    function navigateTo(path) {
        window.history.pushState({}, '', path)
        setData(null)
        setPath(path)
    }

    function handleOpenMessage(message) {
        navigateTo(`/${message.path}/${message.id}`)
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
        setSelectedMessages([])
        navigateTo(`/${folder}`)
    }

    function handleDelete(confirmed) {
        if (confirmed) {
            setDeleting(true)
            deleteMessages(confirmDelete).then(() => {
                setSelectedMessages(current => current.filter(id => !confirmDelete.includes(id)))
                setDeleting(false)
                setConfirmDelete(false)
            })
            if (isMessage(data)) {
                navigateTo(`/${data.path}`)
            }
        } else {
            setConfirmDelete(isMessage(data) ? [data.id] : selectedMessages.slice())
        }
    }

    function cancelDelete() {
        setConfirmDelete(false)
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
                                <a className="btn btn-danger" onClick={() => handleDelete(false)}>
                                    <i className="fas fa-trash"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <FolderList folders={folders} currPath={currPath} onSelectFolder={handleSelectFolder} />
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
            <div className={`modal fade d-block ${confirmDelete ? ' show' : ''}`} id="deleteModal" tabIndex="-1" role="dialog">
                <div className="modal-dialog confirm-modal" role="document">
                    <div className="modal-content">
                        <div className="modal-header bg-danger">
                            <h5 className="modal-title text-light">Confirm</h5>
                            <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={cancelDelete}>
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body text-center pb-0">
                            <p>Do you really want to delete {isMessage(data)
                                ? 'this message'
                                : `${selectedMessages.length} message${selectedMessages.length > 1 ? 's' : ''}`
                            }?</p>
                        </div>
                        <div className="modal-footer" style={{justifyContent: 'center'}}>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={cancelDelete} style={{minWidth: '75px'}}>
                                Cancel
                            </button>
                            <button type="button" className="btn btn-danger" onClick={() => handleDelete(true)} style={{minWidth: '75px'}}>
                                {deleting ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`modal-backdrop d-block fade ${confirmDelete ? 'show' : ''}`}></div>
        </>
    )
}

export default MainLayout
