import { Validator } from './validator.js'

const key_bangs_custom = "custom_bangs";
const key_default_bang = "default-bang";

function set(data, key, validator) {
    Validator.is_of_type(key, 'string');
    Validator.validate_maybe_type(validator, 'function');

    if (validator) {
        validator(data);
    }

    localStorage.setItem(key, JSON.stringify(data));
}

function get(key, validator) {
    const data = JSON.parse(localStorage.getItem("myKey") || "[]");

    if (validator) {
        validator(data);
    }

    return data;
}

export function set_local_bangs(data) {
    set(data, key_bangs_custom, validate_bangs)
}

export function set_default_bang(data) {
    set(data, key_default_bang, validate_default)
}

export function get_local_bangs() {
    return get(key_bangs_custom, validate_bangs);
}

export function get_default_bang() {
    try {
        get(key_default_bang, validate_default);
    } catch {
        return undefined;
    }
}


const validate_default = (data) => {
    Validator.is_of_type(data, 'string');
}


const validate_bangs = (data) => {
    data.forEach(element => {
        Validator.is_of_type(element.c, 'string');
        Validator.is_of_type(element.r, 'string');
        Validator.is_of_type(element.s, 'string');
        Validator.is_of_type(element.sc, 'string');
        Validator.is_of_type(element.t, 'string');
        Validator.is_of_type(element.u, 'string');
    });

}