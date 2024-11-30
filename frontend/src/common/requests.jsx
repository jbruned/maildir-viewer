import { findKeyRecursive } from "./utils"

const BASE_URL = 'http://localhost:8080/api'
const MOCK_BACKEND = true
const MOCK_DELAY = 1000 // ms
const FAKE_MESSAGES = [
    {
        id: 1,
        subject: 'Meeting Reminder',
        sender: 'test1@domain.com',
        recipient: 'test2@domain.com',
        date: '2024-08-01T10:00:00.0+00:00',
        body: "Here's a reminder about the upcoming meeting. Please make sure to attend on time as we have a lot to discuss and the room is booked right after.",
        path: 'Inbox'
    },
    {
        id: 2,
        subject: 'Project Update',
        sender: 'test3@domain.com',
        recipient: 'test2@domain.com',
        date: '2024-08-01T08:55:00.0+00:00',
        body: "We've made significant progress on the project since last week and are on track to meet the deadline. This is a long message that should be truncated, and if it isn't yet, then it should be now. Or now. Or now. Jeez, how wide is the damn viewport? I give up, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec",
        path: 'Inbox'
    }
]
const FAKE_FOLDERS = {
    'Inbox': {},
    'Sent': {},
    'Drafts': {},
    'Trash': {},
    'Projects': {
        'Project Alpha': {},
        'Project Beta': {}
    }
}
const FAKE_ADDRESS = 'user@domain.com'
var loggedIn = false

export const requestMessages = async (path) => {
    if (MOCK_BACKEND) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const messageId = path.match(/\d+$/),
                      strippedPath = path.replace(/\/$/, '').replace(/^\//, '')
                if (messageId) {
                    const message = FAKE_MESSAGES.find(message => message.id === parseInt(messageId[0]))
                    if (message) {
                        resolve(message)
                    } else {
                        reject('Message not found')
                    }
                } else {
                    if (findKeyRecursive(FAKE_FOLDERS, strippedPath)) {
                        resolve(FAKE_MESSAGES.filter(message => message.path === strippedPath))
                    } else {
                        reject('Folder not found')
                    }
                }
            }, MOCK_DELAY)
        })
    }
    const response = await fetch(`${BASE_URL}/${strippedPath}`)
    return await response.json()
}

export const requestFolders = async () => {
    if (MOCK_BACKEND) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(FAKE_FOLDERS)
            }, MOCK_DELAY)
        })
    }
    const response = await fetch(`${BASE_URL}/folders`)
    return await response.json()
}

export const requestUsername = async () => {
    if (MOCK_BACKEND) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (loggedIn) {
                    resolve(FAKE_ADDRESS)
                } else {
                    reject('Not logged in')
                }
            }, MOCK_DELAY)
        })
    }
    const response = await fetch(`${BASE_URL}/login`)
    return await response.json()
}

export const deleteMessages = async (messageIds) => {
    if (MOCK_BACKEND) {
        return new Promise((resolve) => {
            setTimeout(() => {
                FAKE_MESSAGES.splice(FAKE_MESSAGES.findIndex(message => messageIds.includes(message.id)), messageIds.length)
                resolve()
            }, MOCK_DELAY)
        })
    }
    await fetch(`${BASE_URL}/messages/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageIds })
    })
}

export const login = async (username, password) => {
    if (MOCK_BACKEND) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (username === '1234' && password === '1234') {
                    loggedIn = true
                    resolve(FAKE_ADDRESS)
                } else {
                    reject('Invalid credentials')
                }
            }, MOCK_DELAY)
        })
    }
    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    return await response.json()
}

export const logout = async () => {
    if (MOCK_BACKEND) {
        return new Promise((resolve) => {
            setTimeout(() => {
                loggedIn = false
                resolve()
            }, MOCK_DELAY)
        })
    }
    await fetch(`${BASE_URL}/logout`)
}
