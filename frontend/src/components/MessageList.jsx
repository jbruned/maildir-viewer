import React from 'react'
import { formatDate, isToday } from '../common/utils'

export function MessageList({ messages, selectedMessages, onSelectMessage, onOpenMessage }) {
    return <div id="message-list" className="message-list">
        {messages.map(message => (
            <div key={message.id} className="message-list-item">
                <input type="checkbox" className="message-checkbox"
                    onChange={event => onSelectMessage(message, event.target.checked)}
                    checked={selectedMessages.includes(message.id)} />
                <div className="message-summary" onClick={() => onOpenMessage(message)}>
                    <strong>{message.subject}</strong>
                    <small>{message.sender}</small>
                    <p>{message.body}</p>
                </div>
                <p className="message-date">{formatDate(message.date, isToday(message.date) ? 'HH:mm' : 'DD/MM/YYYY')}</p>
            </div>
        ))}
    </div>
}
