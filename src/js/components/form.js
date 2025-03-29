import { CONSTANTS } from '../const.js';
import { Validator } from '../utils.js';
import { Input } from './input.js';

export class Form {
    /**
     * Constructor for the Form class.
     * @param {Input[]} inputs - An array of Input instances.
     * @param {function} onSubmit - A callback function to handle form submission.
     * @param {string} [id='custom-bang-form'] - The ID for the form element.
     * @param {string} [class_dom=''] - Additional CSS classes for the form.
     * @param {...any} args - Additional arguments for the form element.
     */
    constructor(inputs, onSubmit, id = 'custom-bang-form', class_dom = '', ...args) {
        // Validate that inputs is an array of Input instances
        Validator.validateInput(Array.isArray(inputs), 'Inputs must be an array.');
        Validator.validateInput(
            inputs.every(input => Validator.is_of_instance(input, Input)),
            'All elements in the inputs array must be instances of the Input class.'
        );
        Validator.validate_type(onSubmit, 'function', 'onSubmit must be a function.');
        Validator.validate_type(id, 'string', 'Form ID must be a string.');
        Validator.validate_type(class_dom, 'string', 'class_dom must be a string.');

        this.inputs = inputs;
        this.onSubmit = onSubmit;
        this.id = id;
        this.class = class_dom;
        this.args = args ?? [];
    }


    /**
     * Renders the form and its inputs as HTML.
     * @returns {string} The HTML string for the form.
     */
    render() {
        const inputsHTML = this.inputs.map(input => input.render()).join('');
        const additionalArgs = this.args ? this.args.join(' ') : '';
        return `
            <form id="${this.id}" class="${this.class}" onsubmit="return false;" novalidate ${additionalArgs}>
                ${inputsHTML}
                <button class="button-form" type="submit">Add Bang</button>
            </form>
        `;
    }

    /**
     * Attaches event listeners to the form and its inputs.
     */
    attachEventListeners() {
        const formElement = document.getElementById(this.id);
        if (!formElement) {
            throw new Error('Form element not found.');
        }

        // Attach submit event listener
        formElement.addEventListener('submit', event => {
            event.preventDefault();
            this.handleSubmit();
        });

        // Attach input validation listeners
        this.inputs.forEach(input => {
            const inputElement = input.get_dom_input();
            if (inputElement) {
                inputElement.addEventListener('input', () => input.update());
            }
        });
    }

    /**
     * Validates all inputs in the form.
     * @returns {boolean} True if all inputs are valid, false otherwise.
     */
    validate() {
        let isValid = true;
        let firstInvalidInput = null;

        this.inputs.forEach(input => {
            input.update();
            if (!input.is_valid()) {
                isValid = false;
                if (!firstInvalidInput) {
                    firstInvalidInput = input;
                }
            }
        });

        if (firstInvalidInput) {
            const domInput = firstInvalidInput.get_dom_input();
            if (domInput) {
                domInput.focus();
            }
        }

        return isValid;
    }

    /**
     * Handles form submission.
     */
    handleSubmit() {
        if (this.validate()) {
            const formData = this.inputs.reduce((data, input) => {
                data[input.id] = input.getValue();
                return data;
            }, {});
            this.onSubmit(formData);
        }
    }
}