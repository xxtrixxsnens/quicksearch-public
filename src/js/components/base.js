import { CONSTANTS } from "/src/js/const.js";
import { Validator } from "/src/js/utils/validator.js";

/**
 * Base class for creating and managing HTML elements.
 */
export class Base {
    /**
     * @param {Object} obj - Object containing attributes for the HTML element.
     * @param {string} obj.id - The ID of the HTML element.
     * @param {string} obj.tag - The tag name of the HTML element.
     * @param {string} [obj.css=''] - CSS classes to apply to the element.
     * @param {string} [obj.innerHTML=''] - Inner HTML content of the element.
     * @param {string} [obj.aboveHTML=''] - HTML content to render above the element.
     * @param {string} [obj.underHTML=''] - HTML content to render below the element.
     * @param {Object} [obj.sea=undefined] - Values passed that are ignored in this base class
     */
    constructor(obj) {
        // Ignore
        obj.sea = undefined;

        // Validate
        Validator.validate_type(obj.id, 'string', 'id must be a string and set in the obj.');
        Validator.validate_type(obj.tag, 'string', 'tag must be a string and set in the obj.');

        this.obj = obj;
        this.tag = obj.tag;
        this.css = obj.css || '';
        this.innerHTML = obj.innerHTML || '';
        this.aboveHTML = obj.aboveHTML || '';
        this.underHTML = obj.underHTML || '';

        // Undefine non HTML
        obj.tag = undefined;
        obj.css = undefined;
        obj.innerHTML = undefined;
        obj.aboveHTML = undefined;
        obj.underHTML = undefined;
    }

    /**
     * Creates a new Base instance from an existing Base instance.
     * @param {Base} base - The existing Base instance.
     * @returns {Base} A new Base instance.
     */
    static fromBase(base) {
        return new Base({
            ...base.obj,
            tag: base.tag,
            css: base.css,
            innerHTML: base.innerHTML,
            aboveHTML: base.aboveHTML,
            underHTML: base.underHTML,
        });
    }

    /**
     * Describes the current Base instance.
     * @returns {Object} An object describing the Base instance.
     */
    describe() {
        return {
            tag: this.tag,
            obj: this.obj,
            css: this.css,
            innerHTML: this.innerHTML,
            aboveHTML: this.aboveHTML,
            underHTML: this.underHTML,
        };
    }

    /**
     * Creates an object with bound methods for rendering, updating, and DOM retrieval.
     * @returns {Object} An object with bound methods.
     */
    init() {
        const obj = {};
        obj.render = this.render.bind(this);
        obj.update = this.update.bind(this);
        obj.getFromDom = this.getFromDom.bind(this);
        return obj;
    }

    /**
     * Creates a clone of the current Base instance.
     * @returns {Object} A cloned Base instance with bound methods.
     */
    clone() {
        return Base.fromBase(this.describe()).init();
    }

    /**
     * Renders the HTML element as a string.
     * @returns {string} The rendered HTML string.
     */
    render() {
        const element = document.createElement(this.tag);

        for (const [key, value] of Object.entries(this.obj)) {
            if (value !== undefined) {
                element.setAttribute(key, value);
            }
        }

        if (this.innerHTML) element.innerHTML = this.innerHTML;

        return `${this.aboveHTML || ''} ${element.outerHTML} ${this.underHTML || ''}`;
    }

    /**
     * Updates the element. (No-op in this class.)
     */
    update() {
        // Nothing to update in this class
    }

    /**
     * Retrieves the element from the DOM by its ID.
     * @returns {HTMLElement|null} The DOM element or null if not found.
     */
    getFromDom() {
        return document.getElementById(this.obj.id);
    }
}

/**
 * Extended Base class with error handling functionality.
 */
export class BaseWithError extends Base {
    static css = CONSTANTS.ERROR_SYNTAX_CSS;
    static error = CONSTANTS.ERROR_MESSAGE;

    /**
     * @param {Object} obj - Object containing attributes for the HTML element.
     * @param {string} obj.id - The ID of the HTML element.
     * @param {string} obj.class - The CSS class for the element.
     * @param {string} [obj.css=''] - CSS classes to apply to the element.
     * @param {string} [obj.error_css=''] - CSS classes to apply to the error message.
     * @param {string} [obj.innerHTML=''] - Inner HTML content of the element.
     * @param {string} [obj.aboveHTML=''] - HTML content to render above the element.
     * @param {string} [obj.underHTML=''] - HTML content to render below the element.
     * @param {string} error_message - The error message to display.
     */
    constructor(obj, error_message) {
        Validator.validate_type(obj.class, 'string', 'class must be a string and set in the obj.');
        Validator.validate_type(error_message || '', 'string', 'error_msg must be a string!');

        super(obj);

        this.base = this.clone();

        this.class = obj.class;
        obj.class = undefined;

        this.obj = obj;

        const error_message_obj = {
            tag: 'div',
            id: `${obj.id}-error`,
            class: `${BaseWithError.error}`,
            hidden: true
        };
        if (!!error_message) {
            error_message_obj.hidden = undefined;
            error_message_obj.innerHTML = error_message;
        }

        this.error_msg = new Base(error_message_obj).init();
    }

    /**
     * Renders the HTML element with error handling as a string.
     * @returns {string} The rendered HTML string.
     */
    render() {
        return `${this.aboveHTML || ''} ${this.error_msg.render()} ${this.base.render()} ${this.underHTML || ''}`;
    }

    /**
     * Updates the error message and element state.
     * @param {string} [error_message] - The error message to display. If not provided, hides the error.
     */
    update(error_message) {
        if (error_message) {
            Validator.validate_type(error_message, 'string', 'error_msg must be a string!');
            this.error_msg.getFromDom().innerHTML = error_message;
            this.error_msg.getFromDom().removeAttribute('hidden');
            this.base.getFromDom().classList.add(`${this.class}${BaseWithError.css}`);
        } else {
            this.base.getFromDom().classList.remove(`${this.class}${BaseWithError.css}`);
            this.error_msg.getFromDom().setAttribute('hidden', 'true');
        }
    }
}