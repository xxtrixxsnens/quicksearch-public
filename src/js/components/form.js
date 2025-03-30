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
    constructor(obj, onSubmit) {
        // Handle custom inputs
        const inputs = obj.sea.inputs;

        // Validate that inputs is an array of Input instances
        Validator.validateInput(Array.isArray(inputs), 'Inputs must be an array.');
        Validator.validateInput(
            inputs.every(input => Validator.is_of_instance(input, Input)),
            'All elements in the inputs array must be instances of the Input class.'
        );
        Validator.validate_type(onSubmit, 'function', 'onSubmit must be a function.');
        Validator.validate_type(obj.innerHTML || '', 'string', 'innerHTML must be a string.');

        // Process Inputs
        const processedInputs = inputs.map((input) => {
            const data = {
                ...(input.describe()),
                class: input.describe().class || obj.class || 'form-input',
                event: {
                    input: () => input.update(),
                }
            };

            return Input.fromInput(data).init();
        });

        // Set values
        obj.tag = 'form';
        obj.class = obj.class || 'form';

        // Set InnerHTML
        const innerHTML = obj.innerHTML;
        const input_render = processedInputs.map(input => input.render()).join('');
        if (innerHTML) {
            obj.innerHTML = `${innerHTML} ${input_render}`;
        } else {
            obj.innerHTML = input_render;
        }

        super(obj);

        // Clone for more functionality
        this.inputs = processedInputs;
        this.onSubmit = onSubmit;

        // Set own event
        this.event = {
            ...this.event,
            'submit': this.handleSubmit.bind(this)
        }
        this.form = this.clone();

        // Create Submit Button
        const button = new Button({
            id: `${this.attributes.id}-submit`,
            class: `${this.attributes.class}-submit`,
            type: 'submit',
            innerHTML: 'Submit',
            event: {
                submit: this.handleSubmit.bind(this),
            }
        }).init(); // Bind event

        this.button = button;
    }

    /**
     * Creates a new Form instance from an existing Form instance.
     * @param {Form} desc - The existing Form instance.
     * @returns {Form} A new Form instance.
     */
    static fromForm(desc) {
        const onSubmit = desc.sea.onSubmit;
        return new Form({
            ...desc
        }, onSubmit);
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
     * Renders the form and its inputs as HTML.
     * @returns {string} The HTML string for the form.
     */
    render() {
        return `${this.form.render()} ${this.button.render()}`
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