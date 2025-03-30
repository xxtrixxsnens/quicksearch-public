import { Input } from '/src/js/components/input.js';
import { Form } from '/src/js/components/form.js';
import { set_local_bangs, get_local_bangs } from '/src/js/utils/storage.js'

function deepEqual(obj1, obj2) {
    if (obj1 === obj2) {
        return true;
    }

    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
        return false;
    }

    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
}

export class ModBangForm {
    static TYPES = ['add', 'mod'];
    constructor(is_mod, data) {

        Validator.is_of_type_options(ModBangForm.TYPES, obj.sea.type);

        is_mod = obj.sea.type === 'mod';

        if (is_mod) {
            Validator.is_of_type(obj.sea.data, 'object');
        }

        // Define inputs
        const inputs = [
            new Input({ id: 'bang', type: 'text', class: 'input-required', placeholder: 'Bang Tag', required: true, value: is_mod ? data.t : '' }),
            new Input({ id: 'bang-domain', type: 'text', class: 'input-required', placeholder: 'Bang Domain (e.g: duckduckgo.com)', required: true, value: is_mod ? data.d : '' }),
            new Input({ id: 'bang-url', type: 'url', class: 'input-required', placeholder: 'URL (e.g: https://duckduckgo.com/bangs?q={{{s}}})', required: true, value: is_mod ? data.u : '' }),
            new Input({ id: 'bang-category', type: 'text', class: 'input-optional', placeholder: 'Optional: Bang Category (e.g: General)', value: is_mod ? data.c : '' }),
            new Input({ id: 'bang-description', type: 'text', class: 'input-optional', placeholder: 'Optional: Description (e.g: Search the bang shortcuts)', value: is_mod ? data.s : '' }),
            new Input({ id: 'bang-sc', type: 'text', class: 'input-optional', placeholder: 'Optional: KeyWord (e.g: ChatGPT)', value: is_mod ? data.sc : '' })
        ];

        // Define form submission handlers
        const add = (formData) => {
            set_local_bangs([get_local_bangs(), ...formData]);
        };

        const mod = (formData) => {
            const local = get_local_bangs();
            const index = local.findIndex((b) => deepEqual(b, obj.sea.data));
            if (index !== -1) {
                local.splice(index, 1);
            }
            set_local_bangs([local, ...formData]);
        }

        // Create and render the form
        return new Form({
            id: 'custom-bang-form',
            class: 'custom-form', sea: { inputs },
            style: "margin-top: 5%;",
            sea: {
                onSubmit: is_mod ? mod : add,
                inputs: inputs,
            }
        }).init(); // init to bind eventlistener
    }
}

