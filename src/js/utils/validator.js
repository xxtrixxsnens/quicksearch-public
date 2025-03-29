// region: VALIDATOR

/**
 * A utility class for validating input types and values.
 */
export class Validator {
    /**
     * Helper function to validate input parameters.
     *
     * @param {boolean} condition - The condition to validate.
     * @param {string} errorMessage - The error message to throw if the condition fails.
     * @throws {TypeError} If the condition is not met.
     */
    static validateInput(condition, errorMessage) {
        if (!condition) {
            console.assert(false, errorMessage);
            throw new TypeError(errorMessage);
        }
    }

    /**
     * Checks if a value matches the expected type.
     *
     * @param {*} value - The value to validate.
     * @param {string} expectedType - The expected type of the value (e.g., 'string', 'number').
     * 
     * @returns {boolean} - The result
     */
    static is_of_type(value, expectedType) {
        // Validate Input
        Validator.validateInput(typeof expectedType === 'string', 'Expected type must be a string.');

        // Function
        return typeof value === expectedType;
    }

    /**
     * Validates that a value matches the expected type.
     *
     * @param {*} value - The value to validate.
     * @param {string} expectedType - The expected type of the value (e.g., 'string', 'number').
     * @param {string} errorMessage - The error message to throw if validation fails.
     * @throws {TypeError} If `expectedType` is not a string.
     * @throws {TypeError} If `errorMessage` is not a string.
     * @throws {TypeError} If `value` does not match the `expectedType`.
     */
    static validate_type(value, expectedType, errorMessage) {
        // Validate Input
        Validator.validateInput(typeof errorMessage === 'string', 'Error message must be a string.');

        // Function
        if (!Validator.is_of_type(value, expectedType)) {
            console.assert(false, errorMessage, value);
            throw new TypeError(errorMessage);
        }
    }

    /**
     * Checks if a type is included in an array of allowed types.
     *
     * @param {string[]} array_of_types - An array of allowed types (e.g., ['string', 'number']).
     * @param {string} type - The type to check.
     * @returns {boolean} - True if the type is included in the array, false otherwise.
     */
    static is_of_type_options(array_of_types, type) {
        // Validate Input
        Validator.validateInput(Array.isArray(array_of_types), 'First argument must be an array of types.');
        Validator.validateInput(typeof type === 'string', 'Type must be a string.');
        Validator.validateInput(array_of_types.every(t => typeof t === 'string'), 'All elements in the array of types must be strings.');

        // Function
        return array_of_types.includes(type);
    }

    /**
     * Validates that a type is included in an array of allowed types.
     *
     * @param {string[]} array_of_types - An array of allowed types (e.g., ['string', 'number']).
     * @param {string} type - The type to validate.
     * @throws {TypeError} If `array_of_types` is not an array.
     * @throws {TypeError} If `type` is not a string.
     * @throws {TypeError} If any element in `array_of_types` is not a string.
     * @throws {TypeError} If `type` is not included in `array_of_types`.
     */
    static validate_type_options(array_of_types, type) {
        // Function
        if (!Validator.is_of_type_options(array_of_types, type)) {
            const errorMessage = `Type must be one of the following: ${array_of_types.join(', ')}`;
            console.assert(false, errorMessage, type);
            throw new TypeError(errorMessage);
        }
    }

    /**
     * Checks if a value is an instance of a specified class.
     *
     * @param {*} value - The value to check.
     * @param {Function} expectedClass - The class constructor to check against.
     * @returns {boolean} - True if the value is an instance of the expected class, false otherwise.
     */
    static is_of_instance(value, expectedClass) {
        // Validate Input
        Validator.validateInput(typeof expectedClass === 'function', 'Expected class must be a constructor function.');

        // Function
        return value instanceof expectedClass;
    }

    /**
     * Validates that a value is an instance of a specified class.
     *
     * @param {*} value - The value to validate.
     * @param {Function} expectedClass - The class constructor to check against.
     * @param {string} errorMessage - The error message to throw if validation fails.
     * @throws {TypeError} If `expectedClass` is not a function.
     * @throws {TypeError} If `errorMessage` is not a string.
     * @throws {TypeError} If `value` is not an instance of `expectedClass`.
     */
    static validateInstance(value, expectedClass, errorMessage) {
        // Validate Input
        Validator.validateInput(typeof errorMessage === 'string', 'Error message must be a string.');

        // Function
        if (!Validator.is_of_instance(value, expectedClass)) {
            console.assert(false, errorMessage, value);
            throw new TypeError(errorMessage);
        }
    }
}
// endregion: VALIDATOR