function goToHomePage() {
    // You can modify the URL as needed
    window.location.href = "/home_page/";
  }
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

  const csrfToken = getCookie("csrftoken");
  const fileInput = document.getElementById("fileInput");
  const previewContainer = document.getElementById("previewContainer");
  const urlParams = new URLSearchParams(window.location.search);
  const taskID = urlParams.get("taskID");

  function openFileInput() {
    fileInput.click();
  }

  function handleFileSelection() {
    // Clear existing preview
    previewContainer.innerHTML = "";

    const files = fileInput.files;

    for (const file of files) {
      // Create preview elements
      const previewPhoto = document.createElement("img");
      previewPhoto.src = URL.createObjectURL(file);
      previewPhoto.alt = "Selected Photo";
      previewPhoto.classList.add("preview-photo");

      // Append preview to container
      previewContainer.appendChild(previewPhoto);
    }
  }

  async function uploadPhotos() {
    const files = fileInput.files;

    if (files.length === 0) {
      alert("Please choose one or more photos.");
      return;
    }

    const formData = new FormData();
    for (const file of files) {
      formData.append("photos", file);
    }

    // Get the taskID from the URL parameters

    // Add the taskID to the formData
    formData.append("taskID", taskID);

    // Call the API to save photos
    try {
      const response = await fetch(`/photos/`, {
        method: "POST",
        body: formData,
        headers: {
          "X-CSRFToken": csrfToken,
        },
      });

      if (response.ok) {
        // Clear the file input and preview after successful upload
        fileInput.value = null;
        previewContainer.innerHTML = "";

        // Fetch and render updated photos
        fetchAndRenderPhotos();
      } else {
        console.error("Error uploading photos:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading photos:", error);
    }
  }

  async function fetchAndRenderPhotos() {
    // Fetch and render photos after uploading
    try {
      const response = await fetch(`/photos/${taskID}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
      });
      const photos = await response.json();

      // Render photos
      const photoContainer = document.getElementById("photo-container");
      photoContainer.innerHTML = ""; // Clear existing photos

      photos.forEach((photo) => {
        const photoContainerDiv = document.createElement("div");
        photoContainerDiv.classList.add("task-photo-container");

        const imgElement = document.createElement("img");
        imgElement.src = photo.image;
        imgElement.alt = "Task Photo";
        imgElement.classList.add("task-photo");

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");
        deleteButton.innerHTML = "&#10006;"; // Unicode for '✖'

        deleteButton.addEventListener("click", async () => {
          // Call the delete photo API
          try {
            const deleteResponse = await fetch(
              `/photos/${taskID}/${photo.id}/`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  "X-CSRFToken": csrfToken,
                },
              }
            );

            if (deleteResponse.ok) {
              // Remove the photo from the UI
              photoContainerDiv.remove();
            } else {
              console.error(
                "Error deleting photo:",
                deleteResponse.statusText
              );
            }
          } catch (error) {
            console.error("Error deleting photo:", error);
          }
        });

        photoContainerDiv.appendChild(imgElement);
        photoContainerDiv.appendChild(deleteButton);

        photoContainer.appendChild(photoContainerDiv);
      });
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    // Get the taskID from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const taskID = urlParams.get("taskID");

    // Fetch and render initial photos
    await fetchAndRenderPhotos();
  });