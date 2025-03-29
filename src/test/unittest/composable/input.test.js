import { it, assert, assertEqualObj } from '/src/test/framework/test_util.js';
import { Input } from '/src/js/components/input.js';

export function test_input() {
    const app = document.getElementById("app");
    const test = document.createElement("div");
    test.id = "test-input";
    app.appendChild(test);

    // Test case 1: Input renders correctly
    it("Input renders correctly", () => {
        const obj = {
            id: "test-input-1",
            type: "text",
            class: "input-class",
            placeholder: "Enter text"
        };

        const input = new Input(obj).init();
        const renderedHTML = input.render();
        const expect = '<div id="test-input-1-error" class="error-message" hidden="true"></div>   <input id="test-input-1" type="text" class="input-class" placeholder="Enter text">';

        console.log("Test Case 1 - Input Object:", obj);
        console.log("Test Case 1 - Rendered HTML:", renderedHTML);
        console.log("Test Case 1 - Expected to include:", expect)

        assert(renderedHTML.includes(expect))
    });

    // Test case 2: Input validates correctly with valid value
    it("Input validates correctly with valid value", () => {
        const obj = {
            id: "test-input-2",
            type: "text",
            class: "input-class"
        };

        const input = new Input(obj);
        test.innerHTML = input.render();

        const domInput = document.getElementById("test-input-2");
        domInput.value = "Valid value";

        console.log("Test Case 2 - Input Object:", obj);
        console.log("Test Case 2 - DOM Input Value:", domInput.value);

        assert(input.is_valid(), "Input should be valid with a valid value");
    });

    // Test case 3: Input validates correctly with invalid value
    it("Input validates correctly with invalid value", () => {
        const obj = {
            id: "test-input-3",
            type: "email",
            class: "input-class"
        };

        const input = new Input(obj);
        test.innerHTML = input.render();

        const domInput = document.getElementById("test-input-3");
        domInput.value = "invalid-email";

        console.log("Test Case 3 - Input Object:", obj);
        console.log("Test Case 3 - DOM Input Value:", domInput.value);

        assert(!input.is_valid(), "Input should be invalid with an invalid value");
    });

    // Test case 4: Input retrieves sanitized value
    it("Input retrieves sanitized value", () => {
        const obj = {
            id: "test-input-4",
            type: "text",
            class: "input-class"
        };

        const input = new Input(obj);
        test.innerHTML = input.render();

        const domInput = document.getElementById("test-input-4");
        domInput.value = "<script>alert('XSS')</script>";

        const sanitizedValue = input.getValue();

        console.log("Test Case 5 - Input Object:", obj);
        console.log("Test Case 5 - DOM Input Value:", domInput.value);
        console.log("Test Case 5 - Sanitized Value:", sanitizedValue);

        assert(sanitizedValue === "&lt;script&gt;alert('XSS')&lt;/script&gt;", "Input value was not sanitized correctly");
    });
}