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
        body: "Here's a reminder about the upcoming meeting. Please make sure to attend on time as we have a lot to discuss and the room is booked right after."
    },
    {
        id: 2,
        subject: 'Project Update',
        sender: 'test3@domain.com',
        recipient: 'test2@domain.com',
        date: '2024-08-01T08:55:00.0+00:00',
        body: "We've made significant progress on the project since last week and are on track to meet the deadline. This is a long message that should be truncated, and if it isn't yet, then it should be now. Or now. Or now. Jeez, how wide is the damn viewport? I give up, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec"
    }
]
const FAKE_FOLDERS = {
    Inbox: {},
    Sent: {},
    Drafts: {},
    Trash: {},
    Projects: {
        'Project Alpha': {},
        'Project Beta': {}
    }
}

export const requestMessages = async (path) => {
    if (MOCK_BACKEND) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(path.length > 1 ? FAKE_MESSAGES[0] : FAKE_MESSAGES)
            }, MOCK_DELAY)
        })
    }
    const response = await fetch(`${BASE_URL}/messages/${path}`)
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
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ username: 'test3@domain.com' })
            }, MOCK_DELAY)
        })
    }
    const response = await fetch(`${BASE_URL}/login`)
    return await response.json()
}
