export const hexToRGBA = (hex: string, opacity: number = 10) => {
    const r = parseInt(hex.substring(1, 3), 16)
    const g = parseInt(hex.substring(3, 5), 16)
    const b = parseInt(hex.substring(5, 7), 16)

    const alpha = opacity / 100

    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
