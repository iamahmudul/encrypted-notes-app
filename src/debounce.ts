function debounce<Args extends unknown[]>(
    fn: (...args: Args) => void,
    delay: number
) {
    let timeoutId: number | undefined;

    const debounced = (...args: Args) => {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => fn(...args), delay)
    };

    return debounced;
}

export default debounce;