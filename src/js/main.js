import { custom_bangs } from './bang/custom_bang.js';
import { duck_bangs } from './bang/bang.js';
import { LS_DEFAULT_BANG, set_default, custom_bangs as getCustomBangs, bang_insert } from './store.js';

const bangs = [...getCustomBangs(), ...custom_bangs, ...duck_bangs]

function noSearchDefaultPageRender() {
  const app = document.querySelector("#app");
  if (!app) {
    throw new Error("App element not found");
  }
  app.innerHTML = `
  <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
    <div class="content-container">
      <h1>QuickSearch</h1>
      <p>A derivative of <a href="https://github.com/t3dotgg/unduck">Unduck by Theo Browne</a>. DuckDuckGo's bang redirects are too slow. Add the following URL as a custom search engine to your browser. Enables <a href="https://duckduckgo.com/bang.html" target="_blank">all of DuckDuckGo's bangs.</a></p>
      <div class="url-container"> 
        <input 
          type="text" 
          class="url-input"
          value="https://xxtrixxsnens.github.io/quicksearch-public/?q=%s"
          readonly 
        />
        <button class="copy-button">
          <img src="./public/clipboard.svg" alt="Copy" />
        </button>
      </div>
</div>
      <div class="button-group">
    <button id="add-button" class="button add-button">
        <img src="./public/plus.svg" alt="Add" class="icon">
    </button>
    <button id="show-button" class="button show-button">
        <img src="./public/list.svg" alt="Show" class="icon">
    </button>
    <button id="default-button" class="button default-button">
        <img src="./public/tag.svg" alt="Default" class="icon">
    </button>
    <button id="upload-button" class="button upload-button">
        <img src="./public/upload.svg" alt="Upload" class="icon">
    </button>
    <button id="download-button" class="button download-button">
        <img src="./public/download.svg" alt="Download" class="icon">
    </button>
    </div>
    <footer class="footer">
    </footer>
  </div>
`;

  const copyButton = app.querySelector(".copy-button");
  if (!copyButton) {
    throw new Error("Copy button not found");
  }
  const copyIcon = copyButton.querySelector("img");
  if (!copyIcon) {
    throw new Error("Copy icon not found");
  }
  const urlInput = app.querySelector(".url-input");
  if (!urlInput) {
    throw new Error("URL input not found");
  }

  copyButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(urlInput.value);
    copyIcon.src = "./public/clipboard-check.svg";

    setTimeout(() => {
      copyIcon.src = "./public/clipboard.svg";
    }, 2000);
  });
}

const defaultBang = bangs.find((b) => b.t === LS_DEFAULT_BANG);

function getBangredirectUrl() {
  const url = new URL(window.location.href);
  const query = url.searchParams.get("q")?.trim() ?? "";
  if (!query) {
    noSearchDefaultPageRender();
    return null;
  }

  const match = query.match(/!(\S+)/i);

  const bangCandidate = match?.[1]?.toLowerCase();
  const selectedBang = bangs.find((b) => b.t === bangCandidate) ?? defaultBang;

  // Remove the first bang from the query
  const cleanQuery = query.replace(/!\S+\s*/i, "").trim();

  if (cleanQuery == "") {
    const domain = selectedBang?.d;
    if (!domain) return null;
    return "https://" + domain;
  }

  // Format of the url is:
  // https://www.google.com/search?q={{{s}}}
  const searchUrl = selectedBang?.u.replace(
    "{{{s}}}",
    // Replace %2F with / to fix formats like "!ghr+t3dotgg/unduck"
    encodeURIComponent(cleanQuery).replace(/%2F/g, "/")
  );
  if (!searchUrl) return null;

  return searchUrl;
}

function doRedirect() {
  const searchUrl = getBangredirectUrl();
  if (!searchUrl) return;
  window.location.replace(searchUrl);
}

doRedirect();

// Menu
// Add event listeners for the new buttons
const addButton = document.getElementById('add-button');
const showButton = document.getElementById('show-button');
const defaultButton = document.getElementById('default-button');
const uploadButton = document.getElementById('upload-button');
const downloadButton = document.getElementById('download-button');

if (addButton) {
  addButton.addEventListener('click', () => {
    window.location.href = 'src/html/add.html'
  });
}

if (showButton) {
  showButton.addEventListener('click', () => {
    window.location.href = 'src/html/show.html'
  });
}

if (defaultButton) {
  defaultButton.addEventListener('click', () => {
    const bangTag = prompt("Enter the tag of the bang to set as default:");
    const bangToSetDefault = bangs.find(b => b.t === bangTag);
    if (bangToSetDefault) {
      set_default(bangTag);
      alert(`Default bang set to "!${bangTag}".`);
    } else {
      alert(`Bang "!${bangTag}" not found.`);
    }
  });
}

if (uploadButton) {
  uploadButton.addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';

    fileInput.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result);

            if (data && typeof data === 'object' && Array.isArray(data.bangs)) {
              localStorage.setItem("custom_bangs", JSON.stringify([])); // Clear existing bangs

              data.bangs.forEach(bang => {
                if (bang && typeof bang === 'object' && bang.t && bang.d && bang.u) {
                  bang_insert(bang);
                } else {
                  console.warn("Skipping invalid bang object:", bang);
                }
              });

              if (data.defaultBang) {
                set_default(data.defaultBang)
              }

              // Handle sync data if needed (data.sync)
              // Example:
              // if (data.sync) {
              //   // Process sync data
              // }

              alert('Custom bangs and settings uploaded successfully.');
              window.location.reload();
            } else {
              alert('Invalid file content. Expected a JSON object with a "bangs" array.');
            }
          } catch (error) {
            alert('Error parsing file: ' + error.message);
          }
        };
        reader.readAsText(file);
      }
    };

    fileInput.click();
  });
}

if (downloadButton) {
  downloadButton.addEventListener('click', () => {
    const obj = {
      bangs: getCustomBangs() ?? [],
      defaultBang: LS_DEFAULT_BANG,
      sync: {} // Add sync object if needed
    };

    const json = JSON.stringify(obj, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'custom_bangs.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}