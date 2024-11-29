export const getUpperCaseInitials = (fullName: string): string => {
    const nameParts = fullName.split(' ')

    if (nameParts.length < 2) {
        throw new Error('Full name must include at least a first name and a last name.')
    }

    const firstNameInitial = nameParts[0].charAt(0).toUpperCase()
    const lastNameInitial = nameParts[1].charAt(0).toUpperCase()

    return `${firstNameInitial}${lastNameInitial}`
}
