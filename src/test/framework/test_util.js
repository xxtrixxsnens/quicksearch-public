// Create test framework
/**
 * Describe the test and execute it
 * Errors will be caught and displayed in the console
 *
 * @param desc - description of the test
 * @param fn - test to execute
 */
export function it(desc, fn) {
    try {
        console.log('---');
        console.log(desc);
        fn();
        console.log('\x1b[32m%s\x1b[0m', '\u2714 ' + desc);
        console.log('end \n')
    } catch (error) {
        console.log('\n');
        console.log('\x1b[31m%s\x1b[0m', '\u2718 ' + desc);
        console.error(error);
        console.log('end \n')
    }
}

/**
 * Throws an error if the condition is false
 * @param condition
 */
export function assert(condition, message) {
    if (!condition) {
        console.error(message)
        throw new Error(message);
    }
}

function deepEqual(obj1, obj2) {
    if (obj1 === obj2) {
        return true;
    }

    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
        return false;
    }

    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
}

/**
 * Throws an error if the actual value is not equal to the expected value
 * @param actual
 * @param expected
 */
export function assertEqualObj(expected, actual) {
    if (!deepEqual(expected, actual)) {
        console.log("Expected:", expected, "but got", actual);
        throw new Error(`Expected ${expected}, but got ${actual}`);
    }
}