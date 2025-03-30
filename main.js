document.addEventListener("DOMContentLoaded", function () {
  // Cache DOM elements with reusable selector functions
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  // Cache frequently used elements
  const elements = {
    body: document.body,
    header: $("header"),
    menuToggle: $("#menuToggle"),
    navMenu: $("#mainNav"),
    scrollProgress: $(".scroll-progress"),
    themeToggle: $("#themeToggle"),
    darkModeToggle: $("#darkModeToggle"),
    projectFilters: $$(".project-filter"),
    projectCards: $$(".project-card"),
    navLinks: $$(".nav-link"),
    contactForm: $("#contactForm"),
    heroContainer: $(".hero-container"),
    typedTextElement: $("#typed-text"), // Changed to ID selector for specificity
  };

  // Throttle function for performance optimization
  const throttle = (callback, delay = 100) => {
    let lastCall = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        callback.apply(this, args);
      }
    };
  };

  // Self-executing function to initialize all components
  (() => {
    // Initialize AOS Animation if available
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 800,
        easing: "ease-in-out",
        once: true,
        mirror: false,
      });
    }

    // Initialize all functionality
    initThemeToggle();
    initMobileMenu();
    initScrollEffects();
    initProjectFilters();
    initSmoothScrolling();
    initContactForm();
    initCustomAnimations();
    initPopup();
    initTypedText();
  })();

  function initTypedText() {
    const { typedTextElement } = elements;

    if (!typedTextElement) {
      console.warn("Typed text element not found");
      return;
    }

    // Use Typed.js if available, otherwise fallback to custom TypeWriter
    if (typeof Typed !== "undefined") {
      try {
        new Typed("#typed-text", {
          strings: ["a Developer", "a Designer", "a Creator"],
          typeSpeed: 50,
          backSpeed: 30,
          loop: true,
          startDelay: 500, // Slight delay for better UX
        });
      } catch (error) {
        console.error("Typed.js initialization failed:", error);
        fallbackTypeWriter();
      }
    } else {
      console.warn("Typed.js not available, using fallback");
      fallbackTypeWriter();
    }

    function fallbackTypeWriter() {
      const phrases = ["a Developer", "a Designer", "a Creator"];

      class TypeWriter {
        constructor(element, phrases, options = {}) {
          this.element = element;
          this.phrases = phrases;
          this.typingSpeed = options.typingSpeed || 50;
          this.pauseBetweenPhrases = options.pauseBetweenPhrases || 2000;
          this.eraseSpeed = options.eraseSpeed || 30;
          this.phraseIndex = 0;
          this.charIndex = 0;
          this.isDeleting = false;
        }

        type() {
          const currentPhrase = this.phrases[this.phraseIndex];

          if (this.isDeleting) {
            this.element.textContent = currentPhrase.substring(
              0,
              this.charIndex - 1
            );
            this.charIndex--;
          } else {
            this.element.textContent = currentPhrase.substring(
              0,
              this.charIndex + 1
            );
            this.charIndex++;
          }

          const speedMultiplier = this.isDeleting ? 0.5 : 1;
          let timeout = this.isDeleting
            ? this.eraseSpeed
            : this.typingSpeed * speedMultiplier;

          if (!this.isDeleting && this.charIndex === currentPhrase.length) {
            timeout = this.pauseBetweenPhrases;
            this.isDeleting = true;
          } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
            timeout = 500; // Short pause before next phrase
          }

          setTimeout(() => this.type(), timeout);
        }

        start() {
          this.type();
        }
      }

      try {
        new TypeWriter(typedTextElement, phrases).start();
      } catch (error) {
        console.error("Error initializing fallback typewriter:", error);
      }
    }
  }

  function initPopup() {
    if (!$(".popup-overlay")) {
      document.body.insertAdjacentHTML(
        "beforeend",
        `
          <div class="popup-overlay">
            <div class="popup-container">
              <span class="popup-close">&times;</span>
              <div class="popup-content"></div>
            </div>
          </div>
        `
      );

      const overlay = $(".popup-overlay");
      const closeBtn = $(".popup-close");

      closeBtn.addEventListener("click", closePopup);
      overlay.addEventListener(
        "click",
        (e) => e.target === overlay && closePopup()
      );
      document.addEventListener(
        "keydown",
        (e) =>
          e.key === "Escape" && overlay.style.display === "flex" && closePopup()
      );

      function closePopup() {
        overlay.classList.remove("active");
        document.body.style.overflow = "auto";
        setTimeout(() => (overlay.style.display = "none"), 300);
      }
    }

    const readMoreButtons = $$(".blog-content .btn.btn-outline");
    readMoreButtons.forEach((button) => {
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);

      newButton.addEventListener("click", function (e) {
        e.preventDefault();
        const blogCard = this.closest(".blog-card");
        if (!blogCard) return;

        const data = {
          title:
            blogCard.querySelector(".blog-title")?.textContent ||
            "Article Title",
          category:
            blogCard.querySelector(".blog-category")?.textContent || "Category",
          date: blogCard.querySelector(".blog-date")?.textContent || "Date",
          excerpt:
            blogCard.querySelector(".blog-excerpt")?.textContent ||
            "Excerpt text",
          imageSrc: blogCard.querySelector(".blog-image img")?.src || "",
        };

        const popupContent = $(".popup-content");
        if (popupContent) {
          popupContent.innerHTML = generateArticleHTML(data);
          const overlay = $(".popup-overlay");
          overlay.style.display = "flex";
          setTimeout(() => overlay.classList.add("active"), 10);
          document.body.style.overflow = "hidden";
        }
      });
    });

    function generateArticleHTML(data) {
      return `
        <div class="popup-article">
          <div class="popup-header">
            <span class="popup-category">${data.category}</span>
            <span class="popup-date">${data.date}</span>
          </div>
          <h2 class="popup-title">${data.title}</h2>
          <div class="popup-featured-image">
            ${
              data.imageSrc
                ? `<img src="${data.imageSrc}" alt="${data.title}">`
                : ""
            }
          </div>
          <div class="popup-text">
            <p>${data.excerpt}</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
        </div>
      `;
    }
  }

  function initThemeToggle() {
    const { darkModeToggle, body } = elements;
    if (!darkModeToggle) return;

    const themeIcon = darkModeToggle.querySelector("i");
    if (!themeIcon) return;

    if (localStorage.getItem("theme") === "dark") {
      body.classList.add("dark-mode");
      themeIcon.classList.replace("fa-moon", "fa-sun");
    }

    darkModeToggle.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
      if (body.classList.contains("dark-mode")) {
        themeIcon.classList.replace("fa-moon", "fa-sun");
        localStorage.setItem("theme", "dark");
      } else {
        themeIcon.classList.replace("fa-sun", "fa-moon");
        localStorage.setItem("theme", "light");
      }
    });
  }

  function initMobileMenu() {
    const { menuToggle, navMenu, body } = elements;
    const navLinks = $$(".nav-link");

    if (!menuToggle || !navMenu) return;

    const toggleMenu = () => {
      menuToggle.classList.toggle("active");
      navMenu.classList.toggle("active");
      body.classList.toggle("menu-open");
      const icon = menuToggle.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-times");
      }
    };

    menuToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    });

    document.addEventListener("click", (e) => {
      if (
        navMenu.classList.contains("active") &&
        !navMenu.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        toggleMenu();
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (navMenu.classList.contains("active")) {
          toggleMenu();
        }
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 992) {
        menuToggle.classList.remove("active");
        navMenu.classList.remove("active");
        body.classList.remove("menu-open");
        const icon = menuToggle.querySelector("i");
        if (icon) {
          icon.classList.remove("fa-times");
          icon.classList.add("fa-bars");
        }
      }
    });
  }

  function initScrollEffects() {
    const { header, scrollProgress } = elements;
    const navLinks = $$(".nav-link");
    const sections = $$("section");

    const handleScroll = throttle(() => {
      const scrollPos = window.scrollY;

      if (header) {
        if (scrollPos > 50) {
          header.classList.add("scrolled");
          header.classList.remove("transparent");
        } else {
          header.classList.remove("scrolled");
          header.classList.add("transparent");
        }
      }

      if (scrollProgress) {
        const height =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollPos / height) * 100;
        scrollProgress.style.width = `${scrollPercent}%`;
      }

      if (sections.length && navLinks.length) {
        let current = "";
        sections.forEach((section) => {
          const sectionTop = section.offsetTop - 100;
          if (scrollPos >= sectionTop) {
            current = section.getAttribute("id");
          }
        });

        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${current}`) {
            link.classList.add("active");
          }
        });
      }
    }, 50);

    window.addEventListener("scroll", handleScroll);
    handleScroll();
  }

  function initProjectFilters() {
    const { projectFilters, projectCards } = elements;
    if (!projectFilters.length || !projectCards.length) return;

    projectFilters.forEach((filter) => {
      filter.addEventListener("click", () => {
        projectFilters.forEach((item) => item.classList.remove("active"));
        filter.classList.add("active");

        const filterValue = filter.getAttribute("data-filter");

        projectCards.forEach((card) => {
          const isVisible =
            filterValue === "all" ||
            filterValue === card.getAttribute("data-category");

          if (isVisible) {
            card.style.display = "block";
            setTimeout(() => {
              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
            }, 50);
          } else {
            card.style.opacity = "0";
            card.style.transform = "translateY(20px)";
            setTimeout(() => (card.style.display = "none"), 300);
          }
        });
      });
    });
  }

  function initSmoothScrolling() {
    $$('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");
        if (!targetId || targetId === "#") return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          window.scrollTo({
            top: targetElement.offsetTop - 70,
            behavior: "smooth",
          });
        }
      });
    });
  }

  function initContactForm() {
    const { contactForm } = elements;
    if (!contactForm || typeof emailjs === "undefined") return;

    try {
      emailjs.init("YOUR_USER_ID");
    } catch (error) {
      console.error("EmailJS initialization failed:", error);
      return;
    }

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = {
        name: $("#name")?.value,
        email: $("#email")?.value,
        subject: $("#subject")?.value,
        message: $("#message")?.value,
      };

      if (!formData.name || !formData.email || !formData.message) {
        alert("Please fill in all required fields");
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      emailjs
        .send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
          from_name: formData.name.trim(),
          from_email: formData.email.trim(),
          subject: formData.subject?.trim() || "",
          message: formData.message.trim(),
        })
        .then(() => {
          alert("Message sent successfully!");
          contactForm.reset();
        })
        .catch((error) => {
          alert("Failed to send message. Please try again later.");
          console.error("EmailJS error:", error);
        })
        .finally(() => {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  function initCustomAnimations() {
    const { heroContainer, body } = elements;

    if (heroContainer) {
      document.addEventListener(
        "mousemove",
        throttle((e) => {
          const x = e.clientX / window.innerWidth - 0.5;
          const y = e.clientY / window.innerHeight - 0.5;
          heroContainer.style.transform = `rotateY(${x * 5}deg) rotateX(${
            y * -5
          }deg)`;
        }, 30)
      );
    }

    $$(".split-text-animation").forEach((heading) => {
      const words = heading.textContent.split(" ");
      heading.innerHTML = words
        .map((word, i) => `<span style="--word-index:${i}">${word} </span>`)
        .join("");
    });

    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            scrollObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    $$(".scroll-animate, .testimonial-card").forEach((el) =>
      scrollObserver.observe(el)
    );

    $$(".testimonial-card").forEach((card) => {
      card.addEventListener("click", function () {
        this.classList.toggle("expanded");
      });
    });

    if (!window.matchMedia("(pointer: coarse)").matches) {
      const cursor = document.createElement("div");
      cursor.classList.add("custom-cursor");
      body.appendChild(cursor);

      document.addEventListener(
        "mousemove",
        throttle((e) => {
          cursor.style.left = `${e.clientX}px`;
          cursor.style.top = `${e.clientY}px`;
        }, 10)
      );

      $$("a, button, .hero-btn, .social-link").forEach((el) => {
        el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
        el.addEventListener("mouseleave", () =>
          cursor.classList.remove("hover")
        );
      });

      document.documentElement.classList.add("custom-cursor-enabled");
    }
  }
});
