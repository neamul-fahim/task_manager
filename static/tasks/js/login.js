function submitForm(event) {
    // Prevent default form submission
    event.preventDefault();

    // Get form data
    const formData = new FormData(document.getElementById("login-form"));

    // Get CSRF token from the page
    const csrfToken = document.querySelector(
      "[name=csrfmiddlewaretoken]"
    ).value;

    // Make API request using Fetch API
    fetch(`/login_API/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      credentials: "include",
      body: JSON.stringify(Object.fromEntries(formData)),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Store the token in localStorage
        localStorage.setItem("authToken", data.token);

        // Set the Authorization header for future API requests
        const userToken = localStorage.getItem("authToken");

        // Navigate to another page with the Authorization header
        window.location.href = `/home_page/`;
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Login failed. Please check your credentials and try again.");
      });
  }