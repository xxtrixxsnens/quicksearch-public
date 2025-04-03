const key = "custom_bangs";

export const custom_bangs = () => JSON.parse(localStorage.getItem(key) || "[]");

export const bang_insert = (data) => {
    try {
        const newData = custom_bangs();
        newData.push(data);
        localStorage.setItem(key, JSON.stringify(newData));
    } catch {
        localStorage.setItem("archive", custom_bangs());
        localStorage.setItem(key, [data]);
    }

}

export const bang_delete = (bangObject) => {
    try {
        let currentBangs = custom_bangs();

        // Filter out the bang with the matching object
        const updatedBangs = currentBangs.filter(bang => {
            return !(
                bang.c === bangObject.c &&
                bang.d === bangObject.d &&
                bang.r === bangObject.r &&
                bang.s === bangObject.s &&
                bang.sc === bangObject.sc &&
                bang.t === bangObject.t &&
                bang.u === bangObject.u
            );
        });

        localStorage.setItem(key, JSON.stringify(updatedBangs));

        return true; // Indicate successful deletion
    } catch (error) {
        console.error("Error deleting bang:", error);
        return false; // Indicate deletion failure
    }
};

export const LS_DEFAULT_BANG = localStorage.getItem("default-bang") || 'g';

export const set_default = (tag) => localStorage.setItem("default-bang", tag);