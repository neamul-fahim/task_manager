
function goToHomePage() {
    // You can modify the URL as needed
    window.location.href = "/home_page/";
  }
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
          window.location.href = "/search_page/";
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
      for (let i = 0; cookies.length; i++) {
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

  function renderPhotos(photos) {
    if (photos && photos.length > 0) {
      return `
      <div class="photo-container">
        ${photos
          .map(
            (photo) =>
              `<img class="task-photo" src="${photo.image}" alt="Task Photo">`
          )
          .join("")}
      </div>
    `;
    }
    return "";
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


  async function searchTasks() {
    const query = document.getElementById("searchQuery").value;
    const resultsContainer = document.getElementById(
      "search-results-container"
    );
    resultsContainer.innerHTML = ""; // Clear existing results

    try {
      const response = await fetch(
        `/search_API?query=${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to search tasks");
      }

      const data = await response.json();

      if (data && data.length > 0) {
        data.forEach((result) => {
          const resultCard = document.createElement("div");
          resultCard.className = "search-result";
          const options = { year: 'numeric', month: '2-digit', day: '2-digit'};

          const formattedDate = new Date(result.created_at).toLocaleString('en-US', options);
          const formattedDate_last_update = new Date(result.last_update).toLocaleString('en-US', options);

          resultCard.innerHTML = `
          <div class="due-date">Due Date: ${new Date(
            result.due_date
          ).toLocaleString("en-US", { timeZone: "UTC" })}</div>
          <div class="headings">
            <p class="author">${result.title}</p>
          </div>
          <div class="search-result-content">
            <p class="search-result-content">${result.description}</p>
            ${renderPhotos(result.photos)}
            <button class="edit-photos-button" onclick="editPhotos(${
              result.id
            })">Edit Photos</button>
          </div>

          <div class="date">
            <p >Created at: ${formattedDate}</p>
            <p >Last Updated: ${formattedDate_last_update}</p>
            </div>
             <div class = "is-complete">
            <p for="completeCheckbox">Is Complete</p>
            <input type="checkbox" id="completeCheckbox" ${
              result.is_complete ? "checked" : ""
            } onchange="updateTaskStatus(${result.id}, this.checked)">
            </div>
          <p class="priority">Priority: ${result.priority}</p>
          <div class="action-buttons">
            <button class="edit-button" onclick="editTask(${
              result.id
            })">Edit</button>
            <button class="delete-button" onclick="deleteTaskWithConfirmation(${
              result.id
            })">Delete</button>
          </div>
        `;

          resultsContainer.appendChild(resultCard);
        });
      } else {
        resultsContainer.innerHTML = "<p>No tasks found.</p>";
      }
    } catch (error) {
      console.error("Error searching tasks:", error);
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

  // Function to show confirmation modal and set task ID for deletion
  function deleteTaskWithConfirmation(taskID) {
    const confirmationOverlay = document.getElementById(
      "confirmationOverlay"
    );
    const confirmationModal = document.getElementById("confirmationModal");

    // Set the task ID for deletion
    confirmationModal.dataset.taskID = taskID;

    // Show confirmation modal
    confirmationOverlay.style.display = "block";
    confirmationModal.style.display = "block";
  }

  // Function to confirm deletion
  async function confirmDeletion() {
    const confirmationOverlay = document.getElementById(
      "confirmationOverlay"
    );
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
        throw new Error("Failed to delete task");
      }

      // Reload the page after successful deletion
      location.reload();
    } catch (error) {
      console.error("Error deleting task:", error);
      alert(`Error: ${error.message}`);
    } finally {
      // Hide confirmation modal
      confirmationOverlay.style.display = "none";
      confirmationModal.style.display = "none";
    }
  }

  // Function to cancel deletion
  function cancelDeletion() {
    const confirmationOverlay = document.getElementById(
      "confirmationOverlay"
    );
    const confirmationModal = document.getElementById("confirmationModal");

    // Hide confirmation modal
    confirmationOverlay.style.display = "none";
    confirmationModal.style.display = "none";
  }