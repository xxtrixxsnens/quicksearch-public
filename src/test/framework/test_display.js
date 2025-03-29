// Save the original console.log and console.error functions
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

function formatConsoleMessage(message, ...args) {
    // Show object
    args = args.map(arg => display(arg));

    // Sanitize all arguments
    args = args.map(arg => sanitizeHTML(String(arg)));

    // Handle %s placeholders in the message
    if (args.length > 0) {
        message = message.replace(/%s/g, () => args.shift());
    }

    // Convert all arguments to strings and concatenate them
    let formattedMessage = [message, ...args].map(arg => String(arg)).join(' ');

    // Replace ANSI color codes with HTML span tags
    formattedMessage = formattedMessage.replace(/\x1b\[31m/g, '<span style="color: red;">'); // Red
    formattedMessage = formattedMessage.replace(/\x1b\[32m/g, '<span style="color: green;">'); // Green
    formattedMessage = formattedMessage.replace(/\x1b\[33m/g, '<span style="color: yellow;">'); // Yellow
    formattedMessage = formattedMessage.replace(/\x1b\[0m/g, '</span>'); // Reset

    return formattedMessage;
}


/**
 * Converts all fields of an object into a string representation
 * @param obj - The object to display
 * @returns {string} - String representation of the object
 */
function display(obj) {
    if (obj === null) {
        return 'null';
    }
    if (typeof obj === 'undefined') {
        return 'undefined';
    }
    if (typeof obj !== 'object') {
        return obj.toString();
    }
    if (Array.isArray(obj)) {
        return `[${obj.map(display).join(', ')}]`;
    }
    return `{${Object.entries(obj)
        .map(([key, value]) => `${key}: ${display(value)}`)
        .join(', ')}}`;
}

function sanitizeHTML(input) {
    const element = document.createElement('div');
    element.innerText = input; // Escapes HTML
    return element.innerHTML;
}

// Override console.log to capture the output
console.log = function (message, ...args) {
    // Format the message and display it in the HTML element
    const formattedMessage = formatConsoleMessage(message, ...args);
    document.getElementById("output").innerHTML += '<div>' + formattedMessage + '</div>'; // Append with line break
    // Call the original console.log to still log to the browser's console
    originalConsoleLog(message, ...args);
};

// Override console.error to capture and display errors on the HTML page
console.error = function (message, ...args) {
    // Format the error message and display it in the HTML element
    const formattedMessage = formatConsoleMessage(message, ...args);
    document.getElementById("output").innerHTML += '<div style="color: red; font-weight: bold;">' + formattedMessage + '</div>'; // Display errors in bold red
    // Call the original console.error to still log to the browser's console
    originalConsoleError(message, ...args);
};

// Catch uncaught errors and display them in the HTML
window.onerror = function (message, source, lineno, colno, error) {
    const formattedMessage = formatConsoleMessage(`Error: ${message} at ${source}:${lineno}:${colno}`);
    document.getElementById("output").innerHTML += '<div style="color: red; font-weight: bold;">' + formattedMessage + '</div>';
    // Log the error to the console as well
    originalConsoleError(message, source, lineno, colno, error);
    return true; // Prevent the default browser error handling
};