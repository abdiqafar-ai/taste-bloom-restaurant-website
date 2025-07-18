document.addEventListener("DOMContentLoaded", function () {
  const includeHTML = async () => {
    const components = document.querySelectorAll("[data-include]");

    for (const component of components) {
      const filePath = component.getAttribute("data-include");
      try {
        const response = await fetch(filePath);
        if (!response.ok)
          throw new Error(`Failed to load ${filePath}: ${response.status}`);

        const html = await response.text();
        component.innerHTML = html;

        // Remove the attribute to prevent re-fetching
        component.removeAttribute("data-include");
      } catch (error) {
        console.error(error);
        component.innerHTML = `<div class="alert alert-danger">Component load error: ${error.message}</div>`;
      }
    }

    // Initialize Splide Gallery
    if (document.getElementById("gallery-slider")) {
      new Splide("#gallery-slider", {
        type: "loop",
        perPage: 3,
        perMove: 1,
        gap: "30px",
        autoplay: true,
        pauseOnHover: true,
        breakpoints: {
          1200: {
            perPage: 2,
            gap: "20px",
          },
          768: {
            perPage: 1,
            gap: "15px",
          },
        },
      }).mount();
    }

    // Form submission handling
    const reservationForm = document.getElementById("reservation-form");
    if (reservationForm) {
      reservationForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const formValues = Object.fromEntries(formData.entries());

        // Simple validation
        if (
          !formValues.name ||
          !formValues.email ||
          !formValues.phone ||
          !formValues.guests ||
          !formValues.date ||
          !formValues.time
        ) {
          alert("Please fill in all required fields.");
          return;
        }

        // In a real scenario, you would send this data to Formspree
        // For demo, we'll just show a success message
        alert(
          "Thank you for your reservation! A confirmation will be sent to your email shortly."
        );
        this.reset();
      });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const targetId = this.getAttribute("href");
        if (targetId === "#") return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 90,
            behavior: "smooth",
          });
        }
      });
    });

    // Navbar background change on scroll
    window.addEventListener("scroll", function () {
      const navbar = document.querySelector(".navbar");
      if (window.scrollY > 50) {
        navbar.classList.add("navbar-scrolled");
      } else {
        navbar.classList.remove("navbar-scrolled");
      }
    });

    // Animation on scroll - FIXED: Changed "animated" to "visible"
    const animateElements = document.querySelectorAll(".animate-on-scroll");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible"); // Changed from "animated" to "visible"
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    animateElements.forEach((element) => {
      observer.observe(element);
    });

    // Set minimum date for reservation (today)
    const today = new Date().toISOString().split("T")[0];
    const dateInput = document.querySelector('input[type="date"]');
    if (dateInput) {
      dateInput.setAttribute("min", today);
    }
  };

  includeHTML();
});
