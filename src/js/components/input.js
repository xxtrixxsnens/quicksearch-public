import { BaseWithError } from './base.js';
import { Validator } from "/src/js/utils/validator.js";
import { sanitizeHTML } from '/src/js/utils/sanitize.js';

/**
 * Custom error class for validation errors.
 */
class ValidationError { }

/**
 * Represents an Input component with validation and rendering capabilities.
 */
export class Input extends BaseWithError {
    // List of valid input types for the component
    static VALID_TYPES = [
        'button', 'checkbox', 'color', 'date', 'datetime-local', 'email', 'file',
        'hidden', 'image', 'month', 'number', 'password', 'radio', 'range',
        'reset', 'search', 'submit', 'tel', 'text', 'time', 'url', 'week'
    ];

    /**
     * Constructor for the Input class.
     * @param {Object} obj - Object containing attributes for the input element.
     * @param {function} [validator] - A custom validation function.
     */
    constructor(obj) {
        // Setting values
        obj.tag = 'input';
        // VALIDATION
        super(obj);
        Validator.validate_type_options(Input.VALID_TYPES, obj.type);
        Validator.validate_maybe_type(obj.sea.validator, 'function', 'Validator must be a function.');
        // VALIDATION

        this.validator = obj.sea.validator;
    }

    core() {
        const core = super.core();
        core.is_valid = this.is_valid.bind(this);
        core.getValue = this.getValue.bind(this);
        return core;
    }

    describe() {
        const superDescription = super.describe();
        return {
            ...superDescription,
            tag: this.tag,
            sea: {
                ...superDescription.sea, // Merge the `sea` object from super.describe()
                validator: this.validator,
            },
        };
    }

    /**
     * Validates the input value.
     * @returns {true|string} True if valid, or an error message if invalid.
     */
    get_valid() {
        const input = this.getFromDom();
        if (!input.checkValidity()) {
            return input.validationMessage; // Use browser's validation message
        }
        if (this.validator) {
            try {
                this.validator(input.value)
            } catch (error) {
                return error.message;
            }
        }
        return true;
    }

    /**
     * Checks if the input value is valid.
     * @returns {boolean} True if valid, false otherwise.
     */
    is_valid() {
        return this.get_valid() === true;
    }

    /**
     * Retrieves the sanitized value of the input.
     * @returns {string} The sanitized input value.
     * @throws {ValidationError} If the input is invalid.
     */
    getValue() {
        const input = this.getFromDom();
        if (!this.is_valid()) {
            throw new ValidationError();
        }
        return sanitizeHTML(input.value);
    }

    /**
     * Updates the input's error state based on its validity.
     */
    update() {
        const message = this.get_valid();
        super.update(message === true ? undefined : message); // Update error message if invalid
    }
}