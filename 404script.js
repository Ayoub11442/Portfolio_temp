// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all features
  initializeSpace();
  setupEventListeners();
  incrementCounter();
});

// Initialize space elements
function initializeSpace() {
  // Ensure the stars container exists
  if (!document.querySelector(".stars")) {
    const starsContainer = document.createElement("div");
    starsContainer.classList.add("stars");
    document.body.appendChild(starsContainer);
  }

  createStars();
  createMeteors();

  // Set initial mode based on user preference
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    document.body.classList.add("dark-mode");
    updateModeText();
  }
}

// Create stars
function createStars() {
  const stars =
    document.querySelector(".stars") || document.getElementById("stars");
  if (!stars) return;

  const starCount = 200;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.classList.add("star");

    // Random size between 1-3px
    const size = Math.random() * 2 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;

    // Random position
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;

    // Different twinkle speeds
    star.style.animationDuration = `${Math.random() * 3 + 1}s`;
    star.style.animationDelay = `${Math.random() * 3}s`;

    stars.appendChild(star);
  }
}

// Create meteors
function createMeteors() {
  const meteorsDiv = document.getElementById("meteors");
  const container = meteorsDiv || document.body;

  // Create a meteor every few seconds
  setInterval(
    () => {
      const meteor = document.createElement("div");
      meteor.classList.add("meteor");

      if (meteorsDiv) {
        // First implementation style
        meteor.style.top = `${Math.random() * 50}%`;
        meteor.style.left = `${Math.random() * 50 + 50}%`;
      } else {
        // Second implementation style
        const startPosition = Math.random() * window.innerWidth;
        meteor.style.left = `${startPosition}px`;
        meteor.style.top = "0px";

        // Random size and speed
        const size = Math.random() * 2 + 1;
        const duration = Math.random() * 3 + 1;
        meteor.style.width = `${size}px`;
        meteor.style.height = `${size * 30}px`;
        meteor.style.animationDuration = `${duration}s`;

        // Random angle variation
        const angle = 45 + (Math.random() * 10 - 5);
        meteor.style.transform = `rotate(${angle}deg)`;

        // Set timeout for removal based on animation duration
        setTimeout(() => {
          meteor.remove();
        }, duration * 1000);
      }

      container.appendChild(meteor);

      // Remove meteor after animation (for first implementation)
      if (meteorsDiv) {
        setTimeout(() => {
          meteor.remove();
        }, 2000);
      }
    },
    meteorsDiv ? 4000 : 800
  ); // Different intervals for different implementations
}

// Set up event listeners
function setupEventListeners() {
  // Set up dark mode toggle if it exists
  const toggleButton =
    document.querySelector(".toggle-btn") ||
    document.getElementById("mode-toggle");
  if (toggleButton) {
    toggleButton.addEventListener("click", toggleDarkMode);
  }

  // Set up search functionality
  const searchButton = document.getElementById("search-button");
  if (searchButton) {
    searchButton.addEventListener("click", handleSearch);

    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          handleSearch();
        }
      });
    }
  }

  // Set up other buttons if they exist
  const reportButton = document.getElementById("report-button");
  if (reportButton) {
    reportButton.addEventListener("click", reportIssue);
  }

  const sitemapButton = document.getElementById("sitemap-button");
  if (sitemapButton) {
    sitemapButton.addEventListener("click", showSitemap);
  }

  const easterEggButton = document.getElementById("easter-egg");
  if (easterEggButton) {
    easterEggButton.addEventListener("click", showEasterEgg);
  }
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  updateModeText();
}

// Update mode text
function updateModeText() {
  const modeText = document.getElementById("mode-text");
  if (modeText) {
    modeText.textContent = document.body.classList.contains("dark-mode")
      ? "Light Mode"
      : "Dark Mode";
  }
}

// Handle search
function handleSearch() {
  const searchInput = document.getElementById("search-input");
  if (searchInput && searchInput.value.trim() !== "") {
    alert(
      `Searching for "${searchInput.value}" in our galaxy... No results found in this universe.`
    );
  }
}

// Mock reporting issue
function reportIssue() {
  alert(
    "Thanks for reporting this issue! Our space engineers have been notified."
  );
}

// Mock showing sitemap
function showSitemap() {
  alert(
    "Our sitemap would normally appear here to help you navigate to working pages."
  );
}

// Easter egg function
function showEasterEgg() {
  const messages = [
    "Did you know? There are more 404 pages on the internet than there are stars in our solar system!",
    "Fun fact: The first 404 error was discovered in 1992, when a CERN web server couldn't find a document.",
    "Secret code unlocked: You've found the hidden message! Try konami code: ↑↑↓↓←→←→BA",
    "You've discovered a cosmic wormhole! Unfortunately, it still doesn't lead to the page you wanted.",
  ];

  alert(messages[Math.floor(Math.random() * messages.length)]);
}

// Increment error counter
function incrementCounter() {
  const counter = document.getElementById("count");
  if (!counter) return;

  let count = parseInt(counter.textContent || "0");

  // Get from localStorage if available
  const savedCount = localStorage.getItem("404count");
  if (savedCount) {
    count = parseInt(savedCount);
  }

  count++;
  counter.textContent = count;
  localStorage.setItem("404count", count);
}
