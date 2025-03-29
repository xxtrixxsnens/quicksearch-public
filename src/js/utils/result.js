import { Validator } from "./validator";

// region:      ERROR HANDLING UTILS
/**
 * Indicates that the Result is an Error
 */
class Error {
    constructor(error) {
        Validator.validateInstance(error, globalThis.Error, 'The "error" parameter must be an instance of Error.');
        this.value = error;
    }
}
/**
 * Indicates that the Result is valid and can be used.
 */
class Ok {
    constructor(ok) {
        this.value = ok;
    }
}


export class Result {

    constructor(func, ...args) {
        let result;

        try {
            result = new Ok(func(...args));
        } catch (error) {
            result = new Error(error)
        }

        this.value = result;
    }

    static async async(func, ...args) {
        try {
            let result = func(...args);

            if (result instanceof Promise) {
                result = await result;
            }

            return new Result(() => result);
        } catch (error) {
            return new Result(() => error);
        }
    }

    /**
     * @returns true if the function has not thrown an error.
     */
    is_ok() {
        return Validator.is_of_instance(Ok);
    }

    /**
     * @returns {*} Value of Ok | Error
     */
    get_value() {
        return this.value.value;
    }

    /**
     * 
     * @returns {Ok | Error} - Handle different cases
     */
    result() {
        return this.value;
    }

    /**
     *  @returns {Object} - With functions is_ok() && (value || error)
     */
    resolve() {
        const obj = {};

        obj.is_ok = this.is_ok();

        if (obj.is_ok) {
            obj.value = this.get_value();
        } else {
            obj.error = this.get_value();
        }

        return obj;
    }

    unwrap() {
        const res = this.resolve();

        if (!res.is_ok) {
            throw res.error;
        } else {
            return res.value;
        }
    }

    unwrap_or_default(default_value) {
        const res = this.resolve();

        if (!res.is_ok) {
            return default_value;
        } else {
            return res.value;
        }
    }

    unwrap_or_else(func, ...args) {
        const res = this.resolve();

        if (!res.is_ok) {
            return func(args);
        } else {
            return res.value;
        }
    }

    unwrap_error() {
        const res = this.resolve();

        if (!res.is_ok) {
            return res.error;
        } else {
            return null;
        }
    }
}
// endregion:      ERROR HANDLING UTILS