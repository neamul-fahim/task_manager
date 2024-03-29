# {% extends 'tasks/base.html' %} {% block content %}
# <h1>Tasks</h1>
# <a href="{% url 'search-page' %}" class="search-icon">
#   <img src="/media/search_icon.png" alt="Search Icon" />
# </a>
# <a href="{% url 'filter-page' %}" class="filter-icon">
#   <img src="/media/filter_icon1.png" alt="Filter Icon" />
# </a>
# <div id="article-container" class="card-container"></div>
# <a href="{% url 'create-task-page' %}" class="floating-button"> + </a>

# <!-- Confirmation Modal -->
# <div class="overlay" id="confirmationOverlay"></div>
# <div class="modal" id="confirmationModal">
#   <h2>Confirm Deletion</h2>
#   <p>Are you sure you want to delete this task?</p>
#   <button onclick="confirmDeletion()">Yes, Delete</button>
#   <button onclick="cancelDeletion()">Cancel</button>
# </div>

# <style>
#   body {
#     font-family: Arial, sans-serif;
#     margin: 0;
#     padding: 0;
#     overflow-x: hidden;
#     background-color: #ffffff;
#     color: #000;
#   }

#   .container {
#     margin: 20px;
#   }

#   h1 {
#     color: #000000;
#     text-align: center;
#   }

#   .article-form-container {
#     max-width: 600px;
#     margin: 20px auto;
#     background-color: #a0a0a0;
#     padding: 20px;
#     border-radius: 8px;
#     box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
#   }

#   label {
#     display: block;
#     margin-bottom: 8px;
#     font-weight: bold;
#     color: #000000;
#   }

#   input,
#   textarea,
#   select {
#     width: 100%;
#     padding: 12px;
#     margin-bottom: 16px;
#     box-sizing: border-box;
#     border: 1px solid #ccc;
#     border-radius: 4px;
#     background-color: #ffdfe6;
#     color: #000;
#   }

#   button {
#     background-color: #ffdfe6;
#     color: #000000;
#     padding: 12px 15px;
#     border: none;
#     border-radius: 4px;
#     cursor: pointer;
#   }

#   #image-preview {
#     max-width: 100%;
#     max-height: 200px;
#     margin-bottom: 16px;
#   }

#   .card-container {
#     display: flex;
#     gap: 20px;
#     flex-wrap: wrap;
#   }

#   .card {
#     background-color: #333;
#     color: #fff;
#     border: 1px solid #ddd;
#     border-radius: 8px;
#     padding: 15px;
#     box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
#     flex: 1 0 300px;
#     position: relative;
#     display: flex;
#     flex-direction: column;
#   }

#   .card-content {
#     background-color: #000000;
#     padding: 10px;
#     border-radius: 8px;
#     margin-bottom: 10px;
#     flex: 1;
#   }

#   .card h1,
#   .author,
#   .date {
#     color: #fff;
#   }

#   .author {
#     font-size: 20px;
#   }

#   .date {
#     font-size: 12px;
#     position: absolute;
#     top: 10px;
#     right: 10px;
#   }

#   .article-content {
#     color: #ffffff;
#   }

#   .due-date {
#     position: absolute;
#     top: 10px;
#     left: 10px;
#     font-size: 12px;
#   }

#   .is-complete {
#     position: absolute;
#     bottom: 10px;
#     left: 10px;
#     font-size: 12px;
#   }

#   .priority {
#     position: absolute;
#     bottom: 10px;
#     left: 50%;
#     transform: translateX(-50%);
#     font-size: 12px;
#   }

#   .action-buttons {
#     display: flex;
#     justify-content: flex-end;
#     margin-top: 10px;
#   }

#   .action-buttons button {
#     margin-left: 10px;
#     cursor: pointer;
#   }

#   .edit-button {
#     background-color: #666;
#     color: #ffffff;
#     border: none;
#     padding: 8px;
#     border-radius: 4px;
#   }

#   .delete-button {
#     background-color: red;
#     color: #fff;
#     border: none;
#     padding: 8px;
#     border-radius: 4px;
#   }

#   .ban-button {
#     background-color: black;
#     color: #fff;
#     border: none;
#     padding: 8px;
#     border-radius: 4px;
#   }

#   .floating-button {
#     position: fixed;
#     bottom: 20px;
#     right: 20px;
#     background-color: #ffffff;
#     color: #333;
#     border: none;
#     padding: 15px;
#     border-radius: 50%;
#     font-size: 24px;
#     text-align: center;
#     text-decoration: none;
#     cursor: pointer;
#     box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
#     z-index: 999;
#   }

#   .search-icon {
#     position: fixed;
#     top: 20px;
#     right: 80px; /* Adjusted right position to create space between icons */
#     cursor: pointer;
#   }

#   .search-icon img {
#     width: 50px;
#     height: 50px;
#   }

#   .filter-icon {
#     position: fixed;
#     top: 20px;
#     right: 20px;
#     cursor: pointer;
#   }

#   .filter-icon img {
#     width: 50px;
#     height: 50px;
#   }
#   .photo-container {
#     max-height: 150px;
#     overflow-x: auto;
#     overflow-y: hidden;
#     white-space: nowrap;
#     display: flex;
#     gap: 10px;
#   }

#   .task-photo {
#     max-width: 30%;
#     height: auto;
#     display: inline-block;
#     border-radius: 8px;
#     margin-right: 10px;
#   }

#   /* Custom confirmation modal styles */

#   .overlay {
#     display: none;
#     position: fixed;
#     top: 0;
#     left: 0;
#     width: 100%;
#     height: 100%;
#     background: rgba(0, 0, 0, 0.5);
#   }

#   .modal {
#     display: none;
#     position: fixed;
#     top: 50%;
#     left: 50%;
#     transform: translate(-50%, -50%);
#     background: #fff;
#     padding: 20px;
#     border-radius: 8px;
#     box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
#     z-index: 1000;
#   }

#   .modal h2 {
#     margin-bottom: 20px;
#   }

#   .modal button {
#     background-color: red;
#     color: #fff;
#     padding: 10px 15px;
#     border: none;
#     border-radius: 4px;
#     cursor: pointer;
#   }

#   .modal button:hover {
#     background-color: darkred;
#   }
#   .edit-photos-button {
#     background-color: #666;
#     color: #fff;
#     padding: 8px 12px; /* Adjust the padding for a smaller button */
#     border: none;
#     border-radius: 4px;
#     cursor: pointer;
#   }
# </style>

# <script>
#   async function editPhotos(taskID) {
#     try {
#       // Assuming you have a photo editing page named "edit_photos.html"
#       window.location.href = `/edit_photo_page?taskID=${encodeURIComponent(
#         taskID
#       )}`;
#     } catch (error) {
#       console.error("Error editing photos:", error);
#     }
#   }

#   function getCookie(name) {
#     let cookieValue = null;
#     if (document.cookie && document.cookie !== "") {
#       const cookies = document.cookie.split(";");
#       for (let i = 0; i < cookies.length; i++) {
#         const cookie = cookies[i].trim();
#         if (cookie.startsWith(name + "=")) {
#           cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
#           break;
#         }
#       }
#     }
#     return cookieValue;
#   }
#   // Function to retrieve filter values from local storage
#   function getFilterValues() {
#     const savedFilters =
#       JSON.parse(sessionStorage.getItem("taskFilters")) || {};
#     return savedFilters;
#   }

#   async function fetchTasks() {
#     try {
#       const filterValues = getFilterValues();

#       // Build URL with filter parameters
#       const url = new URL("/task", window.location.origin);
#       url.searchParams.set("creation_date", filterValues.creationDate || "");
#       url.searchParams.set("due_date", filterValues.dueDate || "");
#       url.searchParams.set("priority", filterValues.priority || "");
#       url.searchParams.set("status", filterValues.status || "");
#       const response = await fetch(url.href, {
#         method: "GET",
#         headers: {
#           "Content-Type": "application/json",
#         },
#       });

#       if (!response.ok) {
#         throw new Error("Failed to fetch tasks");
#       }

#       const data = await response.json();
#       console.log("data:---------", data);
#       return data;
#     } catch (error) {
#       console.error("Error fetching tasks:", error);
#       return null;
#     }
#   }

#   async function displayTasks() {
#     const filterValues = getFilterValues();

#     console.log("Filter Values:", filterValues);
#     const tasksContainer = document.getElementById("article-container");
#     const tasks = await fetchTasks();

#     if (tasks && tasks.length > 0) {
#       tasks.forEach((task) => {
#         const card = document.createElement("div");
#         card.className = "card";
#         const formattedDate = new Date(task.created_at)
#           .toISOString()
#           .split("T")[0];

#         let photosHTML = "";
#         if (task.photos && task.photos.length > 0) {
#           photosHTML = `
#             <div class="photo-container">
#               ${task.photos
#                 .map(
#                   (photo) =>
#                     `<img class="task-photo" src="${photo.image}" alt="Task Photo">`
#                 )
#                 .join("")}
#             </div>
#           `;
#         }

#         card.innerHTML = `
#         <div class="due-date">Due Date: ${new Date(
#           task.due_date
#         ).toLocaleString("en-US", { timeZone: "UTC" })}</div>

#           <div class="headings">
#             <p class="author">${task.title}</p>
#           </div>
#           <div class="card-content">
#             <p class="article-content">${task.description}</p>
#             ${photosHTML}
#             <button class="edit-photos-button" onclick="editPhotos(${
#               task.id
#             })">Edit Photos</button>
#           </div>
#           <p class="date">Created at: ${formattedDate}</p>
#           <p class="is-complete">Status: ${
#             task.is_complete ? "Complete" : "Incomplete"
#           }</p>
#           <p class="priority">Priority: ${task.priority}</p>
#           <div class="action-buttons">
#             <button class="edit-button" onclick="editTask(${
#               task.id
#             })">Edit</button>
#             <button class="delete-button" onclick="deleteTaskWithConfirmation(${
#               task.id
#             })">Delete</button>
#           </div>
#         `;
#         tasksContainer.appendChild(card);
#       });
#     } else {
#       tasksContainer.innerHTML = "<p>No tasks available.</p>";
#     }
#   }

#   async function editTask(taskID) {
#     try {
#       // Assuming you have an edit page named "edit_article.html"
#       window.location.href = `/update_task_page?taskID=${encodeURIComponent(
#         taskID
#       )}`;
#     } catch (error) {
#       console.error("Error editing article:", error);
#     }
#   }

#   async function deleteTask(taskID) {
#     try {
#       const csrfToken = getCookie("csrftoken");
#       const response = await fetch(`/task/${taskID}/`, {
#         method: "DELETE",
#         headers: {
#           "Content-Type": "application/json",
#           "X-CSRFToken": csrfToken,
#         },
#       });

#       if (!response.ok) {
#         throw new Error("Failed to delete article");
#       }

#       // Reload the page after successful deletion
#       location.reload();
#     } catch (error) {
#       console.error("Error deleting article:", error);
#       alert(`Error: ${error.message}`);
#     }
#   }

#   // Function to show confirmation modal and set task ID for deletion
#   function deleteTaskWithConfirmation(taskID) {
#     const confirmationOverlay = document.getElementById("confirmationOverlay");
#     const confirmationModal = document.getElementById("confirmationModal");

#     // Set the task ID for deletion
#     confirmationModal.dataset.taskID = taskID;

#     // Show confirmation modal
#     confirmationOverlay.style.display = "block";
#     confirmationModal.style.display = "block";
#   }

#   // Function to confirm deletion
#   async function confirmDeletion() {
#     const confirmationOverlay = document.getElementById("confirmationOverlay");
#     const confirmationModal = document.getElementById("confirmationModal");

#     const taskID = confirmationModal.dataset.taskID;

#     try {
#       const csrfToken = getCookie("csrftoken");
#       const response = await fetch(`/task/${taskID}/`, {
#         method: "DELETE",
#         headers: {
#           "Content-Type": "application/json",
#           "X-CSRFToken": csrfToken,
#         },
#       });

#       if (!response.ok) {
#         throw new Error("Failed to delete article");
#       }

#       // Reload the page after successful deletion
#       location.reload();
#     } catch (error) {
#       console.error("Error deleting article:", error);
#       alert(`Error: ${error.message}`);
#     } finally {
#       // Hide confirmation modal
#       confirmationOverlay.style.display = "none";
#       confirmationModal.style.display = "none";
#     }
#   }

#   // Function to cancel deletion
#   function cancelDeletion() {
#     const confirmationOverlay = document.getElementById("confirmationOverlay");
#     const confirmationModal = document.getElementById("confirmationModal");

#     // Hide confirmation modal
#     confirmationOverlay.style.display = "none";
#     confirmationModal.style.display = "none";
#   }

#   document.addEventListener("DOMContentLoaded", () => {
#     displayTasks();
#   });
# </script>

# {% endblock %}
