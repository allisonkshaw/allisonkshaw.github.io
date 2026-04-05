// Initialize components
document.addEventListener("DOMContentLoaded", function () {
  // Initialize navigation
  initializeNavigation();

  // Initialize form
  initializeForm();
});

// Initialize the mobile navigation
function initializeNavigation() {
  const menuButton = document.getElementById("menu-button");
  const menu = document.getElementById("menu");

  if (menuButton && menu) {
    menuButton.addEventListener("click", () => {
      const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", !isExpanded);
      menu.classList.toggle("hidden");
    });

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
      if (!menu.contains(event.target) && !menuButton.contains(event.target)) {
        menuButton.setAttribute("aria-expanded", "false");
        menu.classList.add("hidden");
      }
    });

    // Close menu on escape key
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        menuButton.setAttribute("aria-expanded", "false");
        menu.classList.add("hidden");
      }
    });

    // Handle keyboard navigation within menu
    const menuItems = menu.querySelectorAll("a");
    const firstMenuItem = menuItems[0];
    const lastMenuItem = menuItems[menuItems.length - 1];

    menuItems.forEach((item) => {
      item.addEventListener("keydown", (event) => {
        if (event.key === "Tab") {
          if (event.shiftKey && item === firstMenuItem) {
            event.preventDefault();
            lastMenuItem.focus();
          } else if (!event.shiftKey && item === lastMenuItem) {
            event.preventDefault();
            firstMenuItem.focus();
          }
        }
      });
    });
  }
}

// Form validation and accessibility
function initializeForm() {
  const form = document.getElementById("contact-form");
  const errorSummary = document.getElementById("error-summary");
  const errorList = document.getElementById("error-list");
  const successMessage = document.getElementById("success-message");
  const messageTextarea = document.getElementById("message");
  const messageRemaining = document.getElementById("message-remaining");
  const submitButton = form?.querySelector("button[type='submit']");
  const submitText = submitButton?.querySelector(".submit-text");
  const loadingText = submitButton?.querySelector(".loading-text");

  // Character count for message field
  if (messageTextarea && messageRemaining) {
    messageTextarea.addEventListener("input", () => {
      const remaining = 500 - messageTextarea.value.length;
      messageRemaining.textContent = remaining;
      messageRemaining.setAttribute("aria-live", "polite");
    });
  }

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const errors = [];

      // Clear previous errors
      errorList.innerHTML = "";
      errorSummary.classList.add("hidden");
      successMessage.classList.add("hidden");

      // Show loading state
      if (submitButton && submitText && loadingText) {
        submitButton.disabled = true;
        submitText.classList.add("hidden");
        loadingText.classList.remove("hidden");
      }

      // Validate required fields
      const requiredFields = form.querySelectorAll('[aria-required="true"]');
      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          errors.push(
            `${field.previousElementSibling.textContent.trim()} is required`
          );
          field.setAttribute("aria-invalid", "true");
        } else {
          field.removeAttribute("aria-invalid");
        }
      });

      // Validate email format
      const emailField = form.querySelector('input[type="email"]');
      if (emailField && emailField.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
          errors.push("Please enter a valid email address");
          emailField.setAttribute("aria-invalid", "true");
        }
      }

      if (errors.length > 0) {
        // Display errors
        errors.forEach((error) => {
          const li = document.createElement("li");
          li.textContent = error;
          errorList.appendChild(li);
        });
        errorSummary.classList.remove("hidden");
        errorSummary.focus();
      } else {
        // Simulate form submission
        try {
          // In a real application, you would make an API call here
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Show success message
          successMessage.classList.remove("hidden");
          successMessage.focus();
          form.reset();

          // Reset character count
          if (messageRemaining) {
            messageRemaining.textContent = "500";
          }
        } catch (error) {
          // Handle submission error
          const li = document.createElement("li");
          li.textContent =
            "An error occurred while submitting the form. Please try again.";
          errorList.appendChild(li);
          errorSummary.classList.remove("hidden");
          errorSummary.focus();
        }
      }

      // Reset loading state
      if (submitButton && submitText && loadingText) {
        submitButton.disabled = false;
        submitText.classList.remove("hidden");
        loadingText.classList.add("hidden");
      }
    });
  }
}

// Add keyboard shortcuts
document.addEventListener("keydown", (event) => {
  // Alt + H for Home
  if (event.altKey && event.key === "h") {
    event.preventDefault();
    document.querySelector("a[href='/']")?.click();
  }
  // Alt + A for About
  if (event.altKey && event.key === "a") {
    event.preventDefault();
    document.querySelector("a[href='/about']")?.click();
  }
  // Alt + S for Services
  if (event.altKey && event.key === "s") {
    event.preventDefault();
    document.querySelector("a[href='/services']")?.click();
  }
  // Alt + C for Contact
  if (event.altKey && event.key === "c") {
    event.preventDefault();
    document.querySelector("a[href='/contact']")?.click();
  }
  // Alt + M for Menu
  if (event.altKey && event.key === "m") {
    event.preventDefault();
    menuButton?.click();
  }
});
