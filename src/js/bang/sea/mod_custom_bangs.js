import { ModBangForm } from "./mod_custom_bangs_form.js";

export function generateBangForm(is_mod, data) {
    const title = is_mod ? 'Modify Bang' : 'Add Bang';

    const hmtl = `
        <div class="content-container" id="custom-bang">
            <h1>${title}</h1>

            <div id="explain"></div>

            <p class="custom-paragraph">The {{{s}}} in the URL is a placeholder that will be replaced dynamically with
                the user's search term when the bang is used. For example, if the user searches for "example" using the
                bang, the URL https://duckduckgo.com/bangs?q={{{s}}} will become https://duckduckgo.com/bangs?q=example.
            </p>

            <button id="toggle">Show full explanation</button>
            <div id="form-container"></div>
        </div>
    </div>`

    const app = document.getElementById('app');
    app.innerHTML = hmtl;

    // EXPLAINATION
    const explain = `<p class="custom-paragraph">The form is designed to collect details for adding a
                                        "Custom Bang,"
                                        which is
                                        essentially a shortcut
                                        for a search query. Here's what each field expects:</p>
                        
                                    <p class="custom-paragraph"><strong>Bang Tag</strong> Name (id="bang (e.g: bang)"): The name of the custom
                                        bang (e.g., "bang").
                                    </p>
                        
                                    <p class="custom-paragraph"><strong>Bang Domain</strong> (id="bang-domain"): The domain of the search engine
                                        or website
                                        (e.g.,
                                        "duckduckgo.com").</p>
                        
                                    <p class="custom-paragraph"><strong>URL</strong> (id="bang-domain"): The URL template for the search query.
                                        The placeholder
                                        {{{s}}}
                                        should be used to
                                        indicate where
                                        the search keyword will be inserted (e.g., https://duckduckgo.com/bangs?q={{{s}}}).</p>
                        
                                    <p class="custom-paragraph"><strong>Bang Category</strong> (id="bang-category"): An optional category for
                                        the bang (e.g.,
                                        "General").</p>
                        
                                    <p class="custom-paragraph"><strong>Description</strong> (id="bang-description"): An optional description of
                                        the bang (e.g.,
                                        "Search the
                                        bang
                                        shortcuts").</p>
                        
                                    <p class="custom-paragraph"><strong>Keyword</strong> (id="bang-sc"): An optional keyword or shortcut for the
                                        bang (e.g.,
                                        "ChatGPT").</p>`

    const toggle_explanation = () => {
        element = document.getElementById("explain");
        button = document.getElementById("toggle");
        if (element.innerHTML !== explain) {
            element.innerHTML = explain;
            button.innerHTML = "Show less";
        } else {
            element.innerHTML = "";
            button.innerHTML = "Show full explanation";
        }
    }

    // Add listener
    const toggle = document.getElementById('toggle');
    toggle.addEventListener('click', toggle_explanation);

    // FORM
    const form_container = document.getElementById('form-container');
    form_container.innerHTML = new ModBangForm(is_mod, data);
}