document.addEventListener("DOMContentLoaded", () => {
  // DOM query helpers
  const $ = document.querySelector.bind(document),
    $$ = document.querySelectorAll.bind(document);

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
    typedText: $("#typed-text"),
    navLinks: $$(".nav-link"),
    sections: $$("section"),
    cursor: $(".cursor"),
    cursorShadow: $(".cursor-shadow"),
    shapes: $$(".floating-shape"),
  };

  // Utility functions
  const throttle = (fn, delay = 100) => {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last >= delay) {
        last = now;
        fn(...args);
      }
    };
  };

  // Initialize all components
  const init = () => {
    // Initialize AOS if available
    typeof AOS !== "undefined" &&
      AOS.init({ duration: 800, easing: "ease-in-out", once: true });

    // Conditionally initialize features based on element existence
    elements.typedText && initTypedText();
    $(".popup-overlay") || initPopup();
    elements.darkModeToggle && initThemeToggle();
    elements.menuToggle && elements.navMenu && initMobileMenu();
    (elements.header || elements.scrollProgress) && initScrollEffects();
    elements.projectFilters.length &&
      elements.projectCards.length &&
      initProjectFilters();

    // Always initialize these features
    initSmoothScrolling();
    elements.contactForm && initContactForm();
    (elements.heroContainer || $(".split-text-animation")) &&
      initCustomAnimations();
    elements.cursor && elements.cursorShadow && initCursorEffects();
  };

  // Typed text animation
  function initTypedText() {
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
      } catch (e) {
        console.error("Typed.js error:", e);
        initFallbackTypeWriter(elements.typedText, phrases);
      }
    } else {
      initFallbackTypeWriter(elements.typedText, phrases);
    }
  }

  // Fallback typewriter for when Typed.js is not available
  function initFallbackTypeWriter(element, phrases) {
    const typewriter = {
      element,
      phrases,
      typingSpeed: 50,
      eraseSpeed: 30,
      pauseBetweenPhrases: 2000,
      phraseIndex: 0,
      charIndex: 0,
      isDeleting: false,

      type() {
        const currentPhrase = this.phrases[this.phraseIndex];
        this.element.textContent = currentPhrase.substring(
          0,
          this.isDeleting ? this.charIndex - 1 : this.charIndex + 1
        );
        this.charIndex += this.isDeleting ? -1 : 1;

        let timeout = this.isDeleting ? this.eraseSpeed : this.typingSpeed;

        if (!this.isDeleting && this.charIndex === currentPhrase.length) {
          timeout = this.pauseBetweenPhrases;
          this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
          this.isDeleting = false;
          this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
          timeout = 500;
        }

        setTimeout(() => this.type(), timeout);
      },

      start() {
        this.type();
      },
    };

    try {
      typewriter.start();
    } catch (e) {
      console.error("Fallback typewriter error:", e);
    }
  }

  // Create popup component
  function initPopup() {
    // Create popup once
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

    const closePopup = () => {
      overlay.classList.remove("active");
      document.body.style.overflow = "auto";
      setTimeout(() => (overlay.style.display = "none"), 300);
    };

    // Event handlers
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

    // Event delegation for blog buttons
    document.addEventListener("click", (e) => {
      const button = e.target.closest(".blog-content .btn.btn-outline");
      if (!button) return;

      const blogCard = button.closest(".blog-card");
      if (!blogCard) return;

      e.preventDefault();

      // Extract blog data
      const data = {
        title:
          blogCard.querySelector(".blog-title")?.textContent || "Article Title",
        category:
          blogCard.querySelector(".blog-category")?.textContent || "Category",
        date: blogCard.querySelector(".blog-date")?.textContent || "Date",
        excerpt:
          blogCard.querySelector(".blog-excerpt")?.textContent ||
          "Excerpt text",
        imageSrc: blogCard.querySelector(".blog-image img")?.src || "",
      };

      // Populate popup content
      const popupContent = $(".popup-content");
      if (popupContent) {
        popupContent.innerHTML = `
          <div class="popup-article">
            <div class="popup-header">
              <span class="popup-category">${data.category}</span>
              <span class="popup-date">${data.date}</span>
            </div>
            <h2 class="popup-title">${data.title}</h2>
            ${
              data.imageSrc
                ? `<div class="popup-featured-image"><img src="${data.imageSrc}" alt="${data.title}"></div>`
                : ""
            }
            <div class="popup-text">
              <p>${data.excerpt}</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          </div>
        `;

        overlay.style.display = "flex";
        setTimeout(() => overlay.classList.add("active"), 10);
        document.body.style.overflow = "hidden";
      }
    });
  }

  // Dark mode toggle
  function initThemeToggle() {
    const { darkModeToggle, body } = elements;
    const themeIcon = darkModeToggle.querySelector("i");
    if (!themeIcon) return;

    // Load saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      body.classList.add("dark-mode");
      themeIcon.classList.replace("fa-moon", "fa-sun");
    }

    // Toggle theme
    darkModeToggle.addEventListener("click", () => {
      const isDarkMode = body.classList.toggle("dark-mode");
      themeIcon.classList.replace(
        isDarkMode ? "fa-moon" : "fa-sun",
        isDarkMode ? "fa-sun" : "fa-moon"
      );
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    });
  }

  // Mobile menu
  function initMobileMenu() {
    const { menuToggle, navMenu, body, navLinks } = elements;

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

    // Event handlers
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

    // Close menu on link click
    navLinks.forEach((link) =>
      link.addEventListener("click", () => {
        navMenu.classList.contains("active") && toggleMenu();
      })
    );

    // Handle responsive behavior
    window.addEventListener("resize", () => {
      window.innerWidth > 992 &&
        navMenu.classList.contains("active") &&
        toggleMenu();
    });
  }

  // Scroll effects
  function initScrollEffects() {
    const { header, scrollProgress, navLinks, sections } = elements;

    const handleScroll = throttle(() => {
      const scrollPos = window.scrollY;

      // Update header classes
      if (header) {
        header.classList.toggle("scrolled", scrollPos > 50);
        header.classList.toggle("transparent", scrollPos <= 50);
      }

      // Update scroll progress bar
      if (scrollProgress) {
        const height =
          document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress.style.width = `${(scrollPos / height) * 100}%`;
      }

      // Update active nav links
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
    handleScroll();
  }

  // Project filtering
  function initProjectFilters() {
    const { projectFilters, projectCards } = elements;

    projectFilters.forEach((filter) => {
      filter.addEventListener("click", () => {
        // Update active filter
        projectFilters.forEach((item) => item.classList.remove("active"));
        filter.classList.add("active");

        const filterValue = filter.getAttribute("data-filter");

        // Filter projects
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

  // Smooth scrolling
  function initSmoothScrolling() {
    document.addEventListener("click", (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const targetId = anchor.getAttribute("href");
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
  }

  // Contact form
  function initContactForm() {
    const { contactForm } = elements;
    if (!contactForm || typeof emailjs === "undefined") return;

    try {
      emailjs.init("YOUR_USER_ID");
    } catch (e) {
      console.error("EmailJS error:", e);
      return;
    }

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = {
        name: $("#name")?.value,
        email: $("#email")?.value,
        subject: $("#subject")?.value,
        message: $("#message")?.value,
      };

      // Validate form
      if (!formData.name || !formData.email || !formData.message) {
        alert("Please fill in all required fields");
        return;
      }

      // Disable submit button
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      // Send email
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

  // Custom animations
  function initCustomAnimations() {
    const { heroContainer, body } = elements;

    // 3D hero effect
    if (heroContainer) {
      document.addEventListener(
        "mousemove",
        throttle((e) => {
          const x = (e.clientX / window.innerWidth - 0.5) * 5;
          const y = (e.clientY / window.innerHeight - 0.5) * -5;
          heroContainer.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
        }, 30)
      );
    }

    // Split text animation
    $$(".split-text-animation").forEach((heading) => {
      heading.innerHTML = heading.textContent
        .split(" ")
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
    document.addEventListener("click", (e) => {
      const card = e.target.closest(".testimonial-card");
      if (card) card.classList.toggle("expanded");
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

      // Hover effects
      document.addEventListener("mouseover", (e) => {
        if (
          e.target.matches("a, button, .hero-btn, .social-link") ||
          e.target.closest("a, button, .hero-btn, .social-link")
        ) {
          cursor.classList.add("hover");
        }
      });

      document.addEventListener("mouseout", (e) => {
        if (
          e.target.matches("a, button, .hero-btn, .social-link") ||
          e.target.closest("a, button, .hero-btn, .social-link")
        ) {
          cursor.classList.remove("hover");
        }
      });

      document.documentElement.classList.add("custom-cursor-enabled");
    }
  }

  // Cursor effects
  function initCursorEffects() {
    const { cursor, cursorShadow, shapes } = elements;

    // Only run cursor effects on devices that support hover
    if (
      !window.matchMedia("(hover: hover)").matches ||
      !cursor ||
      !cursorShadow
    )
      return;

    // Handle cursor movement
    document.addEventListener(
      "mousemove",
      throttle((e) => {
        // Update cursor positions
        [cursor, cursorShadow].forEach((el) => {
          el.style.left = `${e.clientX}px`;
          el.style.top = `${e.clientY}px`;
        });

        // Interact with floating shapes
        shapes.forEach((shape) => {
          const rect = shape.getBoundingClientRect();
          const shapeX = rect.left + rect.width / 2;
          const shapeY = rect.top + rect.height / 2;

          const dx = e.clientX - shapeX;
          const dy = e.clientY - shapeY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Apply movement only when needed
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

  // Handle visibility changes
  document.addEventListener("visibilitychange", () => {
    const animationState = document.hidden ? "paused" : "running";
    elements.shapes?.forEach((shape) => {
      shape.style.animationPlayState = animationState;
    });
  });

  // Initialize shapes animation
  // Simplified version of the floating shapes animation
  (function () {
    const shapes = $$(".floating-shape");
    const background = $(".animated-background");
    if (!shapes.length || !background) return;

    background.classList.add("interactive");

    // Add animation CSS
    const style = document.createElement("style");
    style.textContent = `
      .animated-background { perspective: 1000px; }
      .floating-shape { 
        will-change: transform, filter; 
        transition: transform 0.3s ease-out;
      }
      @media (prefers-reduced-motion: reduce) {
        .floating-shape { transition: none !important; animation: none !important; }
      }
    `;
    document.head.appendChild(style);

    // Simplified shape interaction
    let mouse = { x: 0, y: 0 };

    document.addEventListener(
      "mousemove",
      throttle((e) => {
        mouse = { x: e.clientX, y: e.clientY };

        shapes.forEach((shape) => {
          const rect = shape.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const dx = mouse.x - centerX;
          const dy = mouse.y - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            const factor = 0.05 * (1 - Math.min(1, distance / 200));
            shape.style.transform = `translate(${-dx * factor}px, ${
              -dy * factor
            }px)`;
          } else {
            shape.style.transform = "translate(0, 0)";
          }
        });
      }, 20),
      { passive: true }
    );
  })();

  // Initialize all components
  init();
});
