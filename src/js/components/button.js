import { Base } from "./base.js";
import { Validator } from "/src/js/utils/validator.js";
export class Button extends Base {
    // List of valid input types for the component
    static VALID_TYPES = [
        'button', 'reset', 'submit'
    ];

    constructor(obj) {
        obj.type ?? 'button';
        // Setting values
        obj.tag = 'button';

        // VALIDATION
        // Call super
        super(obj);
        Validator.validate_type_options(Button.VALID_TYPES, obj.type);
        Validator.validate_maybe_type(obj.sea.validate, 'function', 'Button expects obj.sea.validate to be a function')
        //VALIDATION



        this.validator = obj.sea.validator;
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