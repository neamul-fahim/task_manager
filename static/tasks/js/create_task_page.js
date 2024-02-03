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

  function createTask() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const photosInput = document.getElementById("photos");
    const dueDate = document.getElementById("due_date").value;
    const priority = document.getElementById("priority").value;

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

    const csrfToken = getCookie("csrftoken");

    fetch(`/task/`, {
      method: "POST",
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
