import { Base } from "./base";
export class Button extends Base {
    // List of valid input types for the component
    static VALID_TYPES = [
        'button', 'reset', 'submit'
    ];

    constructor() {
        Validator.validate_type_options(Button.VALID_TYPES, obj.type || 'button');

        // Setting values
        obj.tag = 'input';

        // Call super
        super(obj);

        this.validator = validator;
    }
}