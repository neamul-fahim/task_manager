async function updateTaskStatus(taskID,status) {
    // {% comment %} const tasksContainer = document.getElementById("article-container"); {% endcomment %}
    const taskDetails = await fetchTask(taskID);
    console.log("task:---------", taskDetails);

    const title = taskDetails.title;
    const description = taskDetails.description;
    const dueDate = taskDetails.due_date;
    const priority = taskDetails.priority;
    const isComplete = status;

    // Collect selected photos
    const photos = [];

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
  async function editPhotos(taskID) {
    try {
      // Assuming you have a photo editing page named "edit_photos.html"
      window.location.href = `/edit_photo_page?taskID=${encodeURIComponent(
        taskID
      )}`;
    } catch (error) {
      console.error("Error editing photos:", error);
    }
  }

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + "=")) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
  // Function to retrieve filter values from local storage
  function getFilterValues() {
    const savedFilters =
      JSON.parse(sessionStorage.getItem("taskFilters")) || {};
    return savedFilters;
  }
  async function fetchTask(taskID) {
    try {
      const response = await fetch(`/task/${taskID}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch task");
      }

      const data = await response.json();
      console.log("data:---------", data);
      return data;
    } catch (error) {
      console.error("Error fetching task:", error);
      return null;
    }
  }

  async function fetchTasks() {
    try {
      const filterValues = getFilterValues();

      // Build URL with filter parameters
      const url = new URL("/task", window.location.origin);
      url.searchParams.set("creation_date", filterValues.creationDate || "");
      url.searchParams.set("due_date", filterValues.dueDate || "");
      url.searchParams.set("priority", filterValues.priority || "");
      url.searchParams.set("status", filterValues.status || "");
      const response = await fetch(url.href, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      console.log("data:---------", data);
      return data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return null;
    }
  }

  async function displayTasks() {
    const filterValues = getFilterValues();

    console.log("Filter Values:", filterValues);
    const tasksContainer = document.getElementById("article-container");
    const tasks = await fetchTasks();

    if (tasks && tasks.length > 0) {
      tasks.forEach((task) => {
        const card = document.createElement("div");
        card.className = "card";
        const options = { year: 'numeric', month: '2-digit', day: '2-digit'};

        const formattedDate = new Date(task.created_at).toLocaleString('en-US', options);
        const formattedDate_last_update = new Date(task.last_update).toLocaleString('en-US', options);

        let photosHTML = "";
        if (task.photos && task.photos.length > 0) {
          photosHTML = `
            <div class="photo-container">
              ${task.photos
                .map(
                  (photo) =>
                    `<img class="task-photo" src="${photo.image}" alt="Task Photo">`
                )
                .join("")}
            </div>
          `;
        }

        card.innerHTML = `
        <div class="due-date">Due Date: ${new Date(
          task.due_date
        ).toLocaleString("en-US", { timeZone: "UTC" })}</div>

          <div class="headings">
            <p class="author">${task.title}</p>
          </div>
          <div class="card-content">
            <p class="article-content">${task.description}</p>
            ${photosHTML}
            <button class="edit-photos-button" onclick="editPhotos(${
              task.id
            })">Edit Photos</button>
          </div>

          <div class="date">
          <p >Created at: ${formattedDate}</p>
          <p >Last Updated: ${formattedDate_last_update}</p>
          </div>
          <div class = "is-complete">
          <p for="completeCheckbox">Is Complete</p>
          <input type="checkbox" id="completeCheckbox" ${task.is_complete ? "checked" : ""} onchange="updateTaskStatus(${task.id}, this.checked)">
          </div>
          <p class="priority">Priority: ${task.priority}</p>
          <div class="action-buttons">
            <button class="edit-button" onclick="editTask(${
              task.id
            })">Edit</button>
            <button class="delete-button" onclick="deleteTaskWithConfirmation(${
              task.id
            })">Delete</button>
          </div>
        `;
        tasksContainer.appendChild(card);
      });
    } else {
      tasksContainer.innerHTML = "<p>No tasks available.</p>";
    }
  }

  async function editTask(taskID) {
    try {
      // Assuming you have an edit page named "edit_article.html"
      window.location.href = `/update_task_page?taskID=${encodeURIComponent(
        taskID
      )}`;
    } catch (error) {
      console.error("Error editing article:", error);
    }
  }

  async function deleteTask(taskID) {
    try {
      const csrfToken = getCookie("csrftoken");
      const response = await fetch(`/task/${taskID}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete article");
      }

      // Reload the page after successful deletion
      location.reload();
    } catch (error) {
      console.error("Error deleting article:", error);
      alert(`Error: ${error.message}`);
    }
  }

  // Function to show confirmation modal and set task ID for deletion
  function deleteTaskWithConfirmation(taskID) {
    const confirmationOverlay = document.getElementById("confirmationOverlay");
    const confirmationModal = document.getElementById("confirmationModal");

    // Set the task ID for deletion
    confirmationModal.dataset.taskID = taskID;

    // Show confirmation modal
    confirmationOverlay.style.display = "block";
    confirmationModal.style.display = "block";
  }

  // Function to confirm deletion
  async function confirmDeletion() {
    const confirmationOverlay = document.getElementById("confirmationOverlay");
    const confirmationModal = document.getElementById("confirmationModal");

    const taskID = confirmationModal.dataset.taskID;

    try {
      const csrfToken = getCookie("csrftoken");
      const response = await fetch(`/task/${taskID}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete article");
      }

      // Reload the page after successful deletion
      location.reload();
    } catch (error) {
      console.error("Error deleting article:", error);
      alert(`Error: ${error.message}`);
    } finally {
      // Hide confirmation modal
      confirmationOverlay.style.display = "none";
      confirmationModal.style.display = "none";
    }
  }

  // Function to cancel deletion
  function cancelDeletion() {
    const confirmationOverlay = document.getElementById("confirmationOverlay");
    const confirmationModal = document.getElementById("confirmationModal");

    // Hide confirmation modal
    confirmationOverlay.style.display = "none";
    confirmationModal.style.display = "none";
  }

  document.addEventListener("DOMContentLoaded", () => {
    displayTasks();
  });