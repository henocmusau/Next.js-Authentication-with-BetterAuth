
export const isValidEmail = (email: string) => {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.toLowerCase())
}

export const isValidPhoneNumber = (phone: string) => {
    const regex = /^(?:\+243|0)?(?:[\s.-]?[0-9]{6,12})$/
    return regex.test(phone)
}

export const cleanPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/[^\d+]/g, '')

    if (cleaned.startsWith('+243')) {
        return cleaned
    } else if (cleaned.startsWith('243')) {
        return `+${cleaned}`
    }
    else if (cleaned.startsWith('0')) {
        return `+243${cleaned.substring(1)}`
    }
    else {
        return `+243${cleaned}`
    }
}
