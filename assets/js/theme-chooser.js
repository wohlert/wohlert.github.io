var themes = {
  light: {
    "color-fg": "#000",
    "color-bg": "#fff",
  },
  dark: {
    "color-fg": "#000",
    "color-bg": "#fff",
  }
};

var root = document.documentElement.style;
var darkMatcher = window.matchMedia("(prefers-color-scheme: dark)");
var prefersColorScheme = darkMatcher.matches ? "dark" : "light";

window.__onSetTheme = function() {};
window.__setTheme = function(themeName) {
    window.localStorage.setItem("themeName", themeName);

    var theme = themes[themeName];
    Object.keys(theme).forEach(function(key) {
    // Set global custom properties on root element
    root.setProperty("--" + key, theme[key]);
    window.__onSetTheme(theme);
    });
}

function setTheme(themeName) {
    const bodyElement = document.querySelector("body");

    if (themeName == "dark") {
        bodyElement.classList.add("dark-mode");
    } else {
        bodyElement.classList.remove("dark-mode");
    }
};

var savedTheme = window.localStorage.getItem('themeName');
window.__setTheme(savedTheme || prefersColorScheme);

window.addEventListener("load", function() {
    if (!(window.safari != undefined && savedTheme != null)) {
    setTheme(savedTheme || prefersColorScheme);
    }

    const bodyElement = document.querySelector("body");
    bodyElement.style.visibility = "visible";
});

function toggle() {
    let bodyElement = document.querySelector("body");
    const currentMode = bodyElement.classList.contains("dark-mode");
    const themeName = currentMode ? "light" : "dark";

    if (themeName == "dark" && savedTheme == null && window.safari != undefined) {
    alert("Safari warning: dark mode will rasterise images, losing quality");
    }
    
    __setTheme(themeName);
    setTheme(themeName);
}