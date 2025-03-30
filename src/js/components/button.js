import { Base } from "./base.js";
import { Validator } from "/src/js/utils/validator.js";
export class Button extends Base {
    // List of valid input types for the component
    static VALID_TYPES = [
        'button', 'reset', 'submit'
    ];

    constructor(obj, validator) {
        Validator.validate_type_options(Button.VALID_TYPES, obj.type || 'button');

        // Setting values
        obj.tag = 'input';

        // Call super
        super(obj);

        this.validator = validator;
    }

    /**
     * Creates a new Button instance from an existing Button instance.
     * @param {Button} desc - The existing Button instance.
     * @returns {Button} A new Base instance.
     */
    static fromButton(desc) {
        return new Button({
            ...desc
        }, desc.sea.validator);
    }

    describe() {
        const superDescription = super.describe();
        return {
            tag: this.tag,
            sea: {
                ...superDescription.sea,
                validator: this.validator,
            },
            ...superDescription,
        };
    }
}