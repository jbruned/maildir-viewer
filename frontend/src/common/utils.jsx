export const updateUrl = (path) => {
    window.history.pushState({}, '', path)
}

export const formatDate = (isoDate, format) => {
    const date = new Date(isoDate)
    return format.replace('MM', String(date.getMonth() + 1).padStart(2, '0'))
                 .replace('DD', String(date.getDate()).padStart(2, '0'))
                 .replace('YYYY', date.getFullYear())
                 .replace('HH', String(date.getHours()).padStart(2, '0'))
                 .replace('mm', String(date.getMinutes()).padStart(2, '0'))
}

export function isToday(isoDate) {
    const today = new Date(),
          date = new Date(isoDate)
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear()
}
