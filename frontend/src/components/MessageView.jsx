import { formatDate } from "../common/utils";

export function MessageView({ message, navigateTo }) {
    return <div className="message-view">
        <a className="back-btn btn btn-link text-dark" onClick={() => navigateTo(`/${message.path}`)}>
            <i className="fas fa-chevron-left"></i>
        </a>
        <h2 className="message-title">{message.subject}</h2>
        <p className="message-details">
            From: {message.sender}<br />
            To: {message.recipient}<br />
            Date: {formatDate(message.date, "DD/MM/YYYY at HH:mm")}
        </p>
        <hr />
        <p>{message.body}</p>
    </div>
}
