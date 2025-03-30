import { Validator } from "/src/js/utils/validator.js";
import { Button } from "./button.js"
import { Input } from "./input.js"
import { Base } from "./base.js"

export class Form extends Base {
    /**
     * Constructor for the Form class.
     * @param {Object} obj - Object containing attributes for the HTML element.
     * @param {Sea: Input[]} inputs- Array of Inputs stored in sea (@class Base)
     * @param {function} onSubmit - A callback function to handle form submission.
     */
    constructor(obj) {
        // Handle custom inputs
        const inputs = obj.sea.inputs;

        // Set values
        obj.tag = 'form';
        obj.class = obj.class || 'form';

        // Call Super
        super(obj);

        // region: VALIDATION
        Validator.validateInput(Array.isArray(inputs), 'Inputs must be an array.');
        Validator.validateInput(
            inputs.every(input => Validator.is_of_instance(input, Input)),
            'All elements in the inputs array must be instances of the Input class.'
        );
        Validator.validate_type(obj.sea.onSubmit, 'function', 'onSubmit must be a function.')
        // endregion: VALIDATION

        // Process Inputs
        const processedInputs = inputs.map((input) => {
            const data = {
                ...(input.describe()),
                class: input.describe().class || obj.class || 'form-input',
                event: {
                    input: () => input.update(),
                }
            };

            return new Input(data).init();
        });

        // Set InnerHTML
        // Create Submit Button
        const button = new Button({
            id: `${obj.id}-submit`,
            class: `${obj.class}-submit`,
            type: 'submit',
            innerHTML: 'Submit',
        }).core();

        // Modify the render of Form
        const input_render = processedInputs.map(input => input.render()).join('');
        const button_render = button.render();
        if (this.innerHTML) {
            this.innerHTML = `${this.innerHTML} ${input_render} ${button_render}`
        } else {
            this.innerHTML = `${input_render} ${button_render}`;
        }
        this.attributes.novalidate = true;

        // Store state
        this.inputs = processedInputs;
        this.onSubmit = obj.sea.onSubmit;
        this.event = {
            ...this.event,
            submit: this.handleSubmit.bind(this)
        }
    }

    describe() {
        const superDescription = super.describe();
        return {
            ...superDescription,
            tag: this.tag,
            sea: {
                ...superDescription.sea,
                onSubmit: this.onSubmit,
                inputs: this.inputs,
            },
        };
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
    handleSubmit(event) {
        event.preventDefault();

        if (this.validate()) {
            const formData = this.inputs.reduce((data, input) => {
                data[input.getFromDom().id] = input.getValue();
                return data;
            }, {});
            this.onSubmit(formData);
        }
    }
}