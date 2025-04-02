document.addEventListener("DOMContentLoaded", function () {
  // Cache DOM selectors
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  // Essential elements
  const elements = {
    body: document.body,
    header: $("header"),
    menuToggle: $("#menuToggle"),
    navMenu: $("#mainNav"),
    scrollProgress: $(".scroll-progress"),
    darkModeToggle: $("#darkModeToggle"),
    projectFilters: $$(".project-filter"),
    projectCards: $$(".project-card"),
    contactForm: $("#contactForm"),
    heroContainer: $(".hero-container"),
    typedTextElement: $("#typed-text"),
    navLinks: $$(".nav-link"),
    sections: $$("section"),
    cursor: $(".cursor"),
    cursorShadow: $(".cursor-shadow"),
    shapes: $$(".floating-shape"),
  };

  // Throttle for performance
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

  // Initialize all components
  (function init() {
    if (typeof AOS !== "undefined")
      AOS.init({ duration: 800, easing: "ease-in-out", once: true });

    // Initialize all features
    [
      initThemeToggle,
      initMobileMenu,
      initScrollEffects,
      initProjectFilters,
      initSmoothScrolling,
      initContactForm,
      initCustomAnimations,
      initPopup,
      initTypedText,
      initCursorEffects,
    ].forEach((fn) => fn());
  })();

  function initTypedText() {
    const { typedTextElement } = elements;
    if (!typedTextElement) return;

    const phrases = ["a Developer", "a Designer", "a Creator"];

    if (typeof Typed !== "undefined") {
      try {
        new Typed("#typed-text", {
          strings: phrases,
          typeSpeed: 50,
          backSpeed: 30,
          loop: true,
          startDelay: 500,
        });
      } catch (error) {
        console.error("Typed.js error:", error);
        initFallbackTypeWriter(typedTextElement, phrases);
      }
    } else {
      initFallbackTypeWriter(typedTextElement, phrases);
    }
  }

  function initFallbackTypeWriter(element, phrases) {
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
        this.element.textContent = currentPhrase.substring(
          0,
          this.isDeleting ? this.charIndex - 1 : this.charIndex + 1
        );
        this.charIndex += this.isDeleting ? -1 : 1;

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
          timeout = 500; // Pause before next phrase
        }

        setTimeout(() => this.type(), timeout);
      }

      start() {
        this.type();
      }
    }

    try {
      new TypeWriter(element, phrases).start();
    } catch (error) {
      console.error("Fallback typewriter error:", error);
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

    $$(".blog-content .btn.btn-outline").forEach((button) => {
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
          popupContent.innerHTML = `
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
          const overlay = $(".popup-overlay");
          overlay.style.display = "flex";
          setTimeout(() => overlay.classList.add("active"), 10);
          document.body.style.overflow = "hidden";
        }
      });
    });
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
      const isDarkMode = body.classList.contains("dark-mode");
      themeIcon.classList.replace(
        isDarkMode ? "fa-moon" : "fa-sun",
        isDarkMode ? "fa-sun" : "fa-moon"
      );
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    });
  }

  function initMobileMenu() {
    const { menuToggle, navMenu, body, navLinks } = elements;
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
        if (navMenu.classList.contains("active")) toggleMenu();
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 992 && navMenu.classList.contains("active"))
        toggleMenu();
    });
  }

  function initScrollEffects() {
    const { header, scrollProgress, navLinks, sections } = elements;

    const handleScroll = throttle(() => {
      const scrollPos = window.scrollY;

      if (header) {
        header.classList.toggle("scrolled", scrollPos > 50);
        header.classList.toggle("transparent", scrollPos <= 50);
      }

      if (scrollProgress) {
        const height =
          document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress.style.width = `${(scrollPos / height) * 100}%`;
      }

      if (sections.length && navLinks.length) {
        let current = "";
        sections.forEach((section) => {
          if (scrollPos >= section.offsetTop - 100) {
            current = section.getAttribute("id");
          }
        });

        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${current}`
          );
        });
      }
    }, 50);

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call
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
      console.error("EmailJS error:", error);
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

    // 3D hero container effect
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

    // Split text animation
    $$(".split-text-animation").forEach((heading) => {
      const words = heading.textContent.split(" ");
      heading.innerHTML = words
        .map((word, i) => `<span style="--word-index:${i}">${word} </span>`)
        .join("");
    });

    // Scroll animations with Intersection Observer
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

    // Testimonial card expansion
    $$(".testimonial-card").forEach((card) => {
      card.addEventListener("click", function () {
        this.classList.toggle("expanded");
      });
    });

    // Custom cursor (only for non-touch devices)
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

  function initCursorEffects() {
    const { cursor, cursorShadow, shapes } = elements;

    // Only run cursor effects on devices that support hover
    const hasHover = window.matchMedia("(hover: hover)").matches;
    if (!hasHover || !cursor || !cursorShadow) return;

    // Handle cursor movement
    document.addEventListener(
      "mousemove",
      throttle((e) => {
        const cursorPos = { left: e.clientX + "px", top: e.clientY + "px" };
        Object.assign(cursor.style, cursorPos);
        Object.assign(cursorShadow.style, cursorPos);

        // Interact with floating shapes
        shapes.forEach((shape) => {
          const rect = shape.getBoundingClientRect();
          const shapeX = rect.left + rect.width / 2;
          const shapeY = rect.top + rect.height / 2;

          const dx = e.clientX - shapeX;
          const dy = e.clientY - shapeY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const pushX = (dx / distance) * (150 - distance) * 0.2;
            const pushY = (dy / distance) * (150 - distance) * 0.2;
            shape.style.transform = `translate(${-pushX}px, ${-pushY}px)`;
          } else {
            shape.style.transform = "translate(0, 0)";
          }
        });
      }, 30)
    );

    // Handle mouse down/up events
    document.addEventListener("mousedown", () => {
      cursorShadow.style.width = "50px";
      cursorShadow.style.height = "50px";
    });

    document.addEventListener("mouseup", () => {
      cursorShadow.style.width = "40px";
      cursorShadow.style.height = "40px";
    });
  }

  // Pause animations when page is not visible
  document.addEventListener("visibilitychange", () => {
    const animationState = document.hidden ? "paused" : "running";
    elements.shapes?.forEach((shape) => {
      shape.style.animationPlayState = animationState;
    });
  });

  // Fix animations after orientation change on mobile
  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      document.body.classList.add("orientation-changed");
      setTimeout(
        () => document.body.classList.remove("orientation-changed"),
        50
      );
    }, 200);
  });
});
