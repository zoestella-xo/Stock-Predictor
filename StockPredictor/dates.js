function formatDate(date) {
    const yyyy = date.getFullYear()
        // getMonth() is zero-based (0 = January) so add 1 for human-readable month
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