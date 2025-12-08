function formatDate(date) {
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
}

function getNDaysAgo(n) {
    const now = new Date()
    now.setDate(now.getDate() - n)
    return formatDate(now)
}

export const dates = {
    startDate: getNDaysAgo(3),
    endDate: getNDaysAgo(1)
}


console.log(dates)
