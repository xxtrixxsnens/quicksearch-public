export function sanitizeHTML(input) {
    const element = document.createElement('div');
    element.innerText = input; // Escapes HTML
    return element.innerHTML;
}