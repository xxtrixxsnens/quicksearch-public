import { Validator } from "/src/js/utils/validator.js";
import { Button } from "./button.js"
import { Input } from "./input.js"
import { Base } from "./base.js"

export class Form {
    /**
     * Constructor for the Form class.
     * @param {Object} obj - Object containing attributes for the HTML element.
     * @param {Sea: Input[]} inputs- Array of Inputs stored in sea (@class Base)
     * @param {function} onSubmit - A callback function to handle form submission.
     */
    constructor(obj, onSubmit) {
        // Handle custom input
        const inputs = obj.sea.inputs;

        // Validate that inputs is an array of Input instances
        Validator.validateInput(Array.isArray(inputs), 'Inputs must be an array.');
        Validator.validateInput(
            inputs.every(input => Validator.is_of_instance(input, Input)),
            'All elements in the inputs array must be instances of the Input class.'
        );
        Validator.validate_type(onSubmit, 'function', 'onSubmit must be a function.');

        super(obj)

        this.inputs = inputs;
        this.onSubmit = onSubmit;
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
        const formElement = this.getFromDom();
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
            const inputElement = input.getFromDom();
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
            const domInput = firstInvalidInput.getFromDom();
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