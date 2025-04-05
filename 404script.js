// Create stars
function createStars() {
  const stars = document.getElementById("stars");
  const starCount = 200;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.className = "star";

    // Random size between 1-3px
    const size = Math.random() * 2 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;

    // Random position
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;

    // Random delay for twinkling
    star.style.animationDelay = `${Math.random() * 2}s`;

    stars.appendChild(star);
  }
}

// Create meteors
function createMeteors() {
  const meteorsDiv = document.getElementById("meteors");

  setInterval(() => {
    const meteor = document.createElement("div");
    meteor.className = "meteor";

    meteor.style.top = `${Math.random() * 50}%`;
    meteor.style.left = `${Math.random() * 50 + 50}%`;

    meteorsDiv.appendChild(meteor);

    // Remove meteor after animation
    setTimeout(() => {
      meteor.remove();
    }, 2000);
  }, 4000);
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const modeText = document.getElementById("mode-text");
  modeText.textContent = document.body.classList.contains("dark-mode")
    ? "Light Mode"
    : "Dark Mode";
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
  let count = parseInt(counter.textContent);

  // Get from localStorage if available
  const savedCount = localStorage.getItem("404count");
  if (savedCount) {
    count = parseInt(savedCount);
  }

  count++;
  counter.textContent = count;
  localStorage.setItem("404count", count);
}

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  createStars();
  createMeteors();
  incrementCounter();

  // Set initial mode based on user preference
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    document.body.classList.add("dark-mode");
    document.getElementById("mode-text").textContent = "Light Mode";
  }

  // Mock search functionality
  document
    .getElementById("search-button")
    .addEventListener("click", function () {
      const query = document.getElementById("search-input").value;
      if (query.trim() !== "") {
        alert(
          `Searching for "${query}" in our galaxy... No results found in this universe.`
        );
      }
    });

  document
    .getElementById("search-input")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        document.getElementById("search-button").click();
      }
    });
});
// Function to create stars in the background
function createStars() {
  const stars = document.querySelector(".stars");
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

// Function to create meteors in the background
function createMeteors() {
  const container = document.querySelector("body");
  const meteorCount = 10;

  // Create a meteor every few seconds
  setInterval(() => {
    // Create meteor element
    const meteor = document.createElement("div");
    meteor.classList.add("meteor");

    // Set random starting position at the top of the screen
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

    // Append meteor to body
    container.appendChild(meteor);

    // Remove meteor after animation completes
    setTimeout(() => {
      meteor.remove();
    }, duration * 1000);
  }, 800); // Create a new meteor approximately every 800ms
}

// Initialize stars and meteors when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Ensure the stars container exists
  if (!document.querySelector(".stars")) {
    const starsContainer = document.createElement("div");
    starsContainer.classList.add("stars");
    document.body.appendChild(starsContainer);
  }

  // Create the stars
  createStars();

  // Create the meteors
  createMeteors();

  // Set up dark mode toggle if it exists
  const toggleButton = document.querySelector(".toggle-btn");
  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
    });
  }
});
