export function concat(first: string, second: string): string {
    let url: string;
    if (first.endsWith('/')) {
        url = second.startsWith('/') ? first + second.substring(1) : first + second;
    } else {
        url = second.startsWith('/') ? first + second : first + '/' + second;
    }
    return url;
}
