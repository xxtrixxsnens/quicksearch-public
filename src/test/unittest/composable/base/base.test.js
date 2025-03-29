import { it, assert, assertEqualObj } from '/src/test/framework/test_util.js';
import { Base, BaseWithError } from '/src/js/components/base.js';

export function test_base() {
    const app = document.getElementById("app");
    const test = document.createElement("div");
    test.id = "test-base";
    app.appendChild(test);

    // Test case 1: Base class renders correctly
    it("Base class renders correctly", () => {
        const obj = {
            id: "test-id",
            tag: "div",
            innerHTML: "Hello, World!"
        };

        console.log("Input for Base:", obj);

        const base = new Base(obj);
        const renderedHTML = base.render();

        console.log("Output for Base render:", renderedHTML);

        assert(renderedHTML.includes('<div id="test-id">Hello, World!</div>'), "Base render output is incorrect");
    });

    // Test case 2: BaseWithError renders error message correctly
    it("BaseWithError renders error message correctly", () => {
        const obj = {
            id: "test-id",
            tag: "div",
            class: "test-class",
        };

        console.log("Input for BaseWithError:", obj);

        const baseWithError = new BaseWithError(obj, "Error occurred");
        const renderedHTML = baseWithError.render();

        console.log("Output for BaseWithError render:", renderedHTML);

        assert(renderedHTML.includes('<div id="test-id-error" class="error-message">Error occurred</div>'), "BaseWithError error message render is incorrect");
        assert(renderedHTML.includes('<div id="test-id" class="test-class"></div>'), "BaseWithError base render is incorrect");
    });

    // Test case 3: BaseWithError updates error message correctly
    it("BaseWithError updates error message correctly", () => {
        const obj = {
            id: "test-id",
            tag: "div",
            class: "test-class",
        };

        console.log("Input for BaseWithError update:", obj);

        const baseWithError = new BaseWithError(obj);
        test.innerHTML = baseWithError.render();

        console.log("Initial render output:", test.innerHTML);

        baseWithError.update("New error message");
        const errorElement = document.querySelector("#test-id-error");

        console.log("Updated error message:", errorElement.innerHTML);

        assert(errorElement.innerHTML === "New error message", "Error message did not update correctly");
        assert(!errorElement.hasAttribute("hidden"), "Error message should not be hidden");

        baseWithError.update();
        console.log("Error message after clearing:", errorElement.hasAttribute("hidden"));

        assert(errorElement.hasAttribute("hidden"), "Error message should be hidden when empty");
    });
}