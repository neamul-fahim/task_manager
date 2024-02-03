function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + "=")) {
          cookieValue = decodeURIComponent(
            cookie.substring(name.length + 1)
          );
          break;
        }
      }
    }
    return cookieValue;
  }

  async function getTaskDetails(taskID) {
    const csrfToken = getCookie("csrftoken");
    const response = await fetch(`/task/${taskID}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch task details");
      return null;
    }

    const taskDetails = await response.json();
    return taskDetails;
  }

  async function fillFormWithTaskDetails() {
    const taskID = getTaskIdFromQuery();
    const taskDetails = await getTaskDetails(taskID);
    console.log("taskDetails", { taskDetails });

    if (taskDetails) {
      document.getElementById("title").value = taskDetails.title;
      document.getElementById("description").value =
        taskDetails.description;

      // Format the due date to be compatible with the input field
      const formattedDueDate = new Date(taskDetails.due_date)
        .toISOString()
        .slice(0, -8);
      document.getElementById("due_date").value = formattedDueDate;

      document.getElementById("priority").value = taskDetails.priority;
      document.getElementById("is_complete").checked =
        taskDetails.is_complete;

      // Populate existing images
      const existingImagesContainer = document.getElementById(
        "existing-images-container"
      );

      taskDetails.photos.forEach((photo) => {
        const existingImage = document.createElement("img");
        existingImage.src = photo.image;
        existingImage.className = "existing-image";
        existingImagesContainer.appendChild(existingImage);
      });

      // You can implement the logic for displaying existing photos here
    }
  }

  function previewImages() {
    const input = document.getElementById("photos");
    const previewContainer = document.getElementById(
      "image-preview-container"
    );

    // Clear existing previews
    previewContainer.innerHTML = "";

    const files = input.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const reader = new FileReader();

      reader.onload = function (e) {
        const preview = document.createElement("img");
        preview.src = e.target.result;
        preview.className = "image-preview";
        previewContainer.appendChild(preview);
      };

      reader.readAsDataURL(file);
    }
  }

  async function updateTask() {
    const taskID = getTaskIdFromQuery();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const photosInput = document.getElementById("photos");
    const dueDate = document.getElementById("due_date").value;
    const priority = document.getElementById("priority").value;
    const isComplete = document.getElementById("is_complete").checked;

    // Collect selected photos
    const photos = [];
    for (let i = 0; i < photosInput.files.length; i++) {
      photos.push(photosInput.files[i]);
    }

    const data = new FormData();
    data.append("title", title);
    data.append("description", description);
    for (let i = 0; i < photos.length; i++) {
      data.append("photos", photos[i]);
    }
    data.append("due_date", dueDate);
    data.append("priority", priority);
    data.append("is_complete", isComplete);

    const csrfToken = getCookie("csrftoken");

    fetch(`/task/${taskID}/`, {
      method: "PUT",
      headers: {
        "X-CSRFToken": csrfToken,
      },
      body: data,
    })
      .then((response) => {
        if (response.ok) {
          window.location.href = "/home_page/";
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(`Error: ${error.message}`);
      });
  }

  function getTaskIdFromQuery() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get("taskID");
  }

  document.addEventListener("DOMContentLoaded", () => {
    fillFormWithTaskDetails();
  });
