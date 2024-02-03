function submitForm(event) {
    // Prevent default form submission
    event.preventDefault();

    // Display loading indicator
    document.getElementById("loading-indicator").style.display = "block";

    // Get CSRF token from the page
    const csrfToken = document.querySelector(
      "[name=csrfmiddlewaretoken]"
    ).value;

    // Get form data
    const formData = new FormData(document.getElementById("signup-form"));

    // Append CSRF token to form data
    formData.append("csrfmiddlewaretoken", csrfToken);

    // Make API request using Fetch API
    fetch(`/signup_API/`, {
      method: "POST",
      headers: {
        "X-CSRFToken": csrfToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    })
      .then((response) => {
        // Hide loading indicator
        document.getElementById("loading-indicator").style.display = "none";

        if (response.ok) {
          // Successful response, get email from form data
          const email = formData.get("email");

          // Navigate to another page with email as a query parameter
          window.location.href = "/";
        } else {
          // Handle error scenarios
          console.error("Error:", response.statusText);
          alert(
            "Signup failed. Please check your credentials and try again."
          );
        }
      })
      .catch((error) => {
        // Hide loading indicator
        document.getElementById("loading-indicator").style.display = "none";
        console.error("Error:", error);
        alert(
          "Signup failed. Please check your credentials and try again."
        );
      });
  }
