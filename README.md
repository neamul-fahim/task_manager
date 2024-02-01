# task_manager

## HOW TO SET UP AND RUN THE PROJECT

---

Project configuration and demo videos :
https://drive.google.com/drive/folders/1qS2WKmTn0qrifNGMaO8pmk33evZ5RaV-?usp=sharing

1.  Install 'virtualenv' package --> 'pip install virtualenv'
2.  Create virtual environment --> 'virtualenv .venv'
3.  Activate virtual environment --> '.venv/Scripts/Active'
4.  Install all the requirement --> 'pip install -r requirements.txt'
5.  Install another package --> 'pip install python-dotenv'
6.  create .env file in the root folder and configure the database

                NAME='database_name'
                USER='user_name'
                PASSWORD='your_database_password'
                HOST='host'
                PORT='port_number'

7.  Make migrations --> 'python manage.py makemigrations'
8.  Migrate --> 'python manage.py migrate'
9.  Load the database --> 'python manage.py loaddata db.json'. It will generate an error like this:

    ## “unicodedecodeerror: 'utf-8' codec can't decode byte 0xff in position 0: invalid start byte”

    To solve this error plese see the video 'task_manager_first_part.mp4' at '4:40' that i provided.

10. At last run the server --> 'python manage.py runserver'

## Users

---

super user --> username:super, password:12345
user 1 ---> username:fahim, password:12345
user 2 ---> username:sizan, password:12345
user 3 ---> username:tutul, password:12345

## API endpoints documentation

---

---

Below is a basic API documentation for Django REST framework API.

### Table of Contents

1. [Authentication]()
2. [User Endpoints]()
3. [Task Endpoints]()
4. [Photo Endpoints]()
5. [Search and Filter Endpoints]()

---

### Authentication

All endpoints require authentication except for the following:

- `SignupAPIView` - [POST] `/signup_API/`
- `LoginAPIView` - [POST] `/login_API/`

---

### User Endpoints()

#### Get User Information

- **Endpoint:** `/user/`
- **Method:** GET
- **Description:** Retrieve information about the authenticated user.
- **Authentication Required:** Yes
- **Response:**
  - 200 OK: User information in JSON format.

---

#### Signup

- **Endpoint:** `/signup_API/`
- **Method:** POST
- **Description:** Create a new user account.
- **Authentication Required:** No
- **Request Parameters:**
  - `username` (string)
  - `email` (string)
  - `password` (string)
- **Response:**
  - 200 OK: User created successfully.
  - 400 Bad Request: Invalid request parameters.

---

#### Login

- **Endpoint:** `/login_API/`
- **Method:** POST
- **Description:** Authenticate and log in a user.
- **Authentication Required:** No
- **Request Parameters:**
  - `username` (string)
  - `password` (string)
- **Response:**
  - 200 OK: Login successful.
  - 400 Bad Request: Invalid request parameters.
  - 401 Unauthorized: Invalid credentials.

---

#### User Profile Page

- **Endpoint:** `/user_profile_page/`
- **Method:** GET
- **Description:** Display the user's profile page.
- **Authentication Required:** Yes
- **Response:**
  - 200 OK: User profile page.

---

#### Home Page

- **Endpoint:** `/home_page/`
- **Method:** GET
- **Description:** Display the home page.
- **Authentication Required:** Yes
- **Response:**
  - 200 OK: Home page.

---

### Task Endpoints

#### Get Tasks

- **Endpoint:** `/task/`
- **Method:** GET
- **Description:** Retrieve tasks for the authenticated user.
- **Authentication Required:** Yes
- **Query Parameters:**
  - `creation_date` (date) - Filter by creation date.
  - `due_date` (date) - Filter by due date.
  - `priority` (string) - Filter by priority ('high', 'medium', 'low').
  - `status` (string) - Filter by status ('complete', 'incomplete').
- **Response:**
  - 200 OK: List of tasks in JSON format.

---

#### Get Task by ID

- **Endpoint:** `/task/<int:pk>/`
- **Method:** GET
- **Description:** Retrieve a specific task by ID for the authenticated user.
- **Authentication Required:** Yes
- **Response:**
  - 200 OK: Task details in JSON format.
  - 404 Not Found: Task not found.

---

#### Create Task

- **Endpoint:** `/task/`
- **Method:** POST
- **Description:** Create a new task for the authenticated user.
- **Authentication Required:** Yes
- **Request Parameters:**
  - Task details as per `TaskModelSerializer`.
  - `photos` (list of files) - Task photos.
- **Response:**
  - 201 Created: Task created successfully.
  - 400 Bad Request: Invalid request parameters.

---

#### Update Task

- **Endpoint:** `/task/<int:pk>/`
- **Method:** PUT
- **Description:** Update an existing task by ID for the authenticated user.
- **Authentication Required:** Yes
- **Request Parameters:**
  - Task details as per `TaskModelSerializer`.
  - `photos` (list of files) - Task photos.
- **Response:**
  - 200 OK: Task updated successfully.
  - 400 Bad Request: Invalid request parameters.
  - 404 Not Found: Task not found.

---

#### Delete Task

- **Endpoint:** `/task/<int:pk>/`
- **Method:** DELETE
- **Description:** Delete an existing task by ID for the authenticated user.
- **Authentication Required:** Yes
- **Response:**
  - 200 OK: Task deleted successfully.
  - 404 Not Found: Task not found.

---

### Photo Endpoints

#### Get Photos for a Task

- **Endpoint:** `/photos/<int:task_id>/`
- **Method:** GET
- **Description:** Retrieve photos for a specific task.
- **Authentication Required:** Yes
- **Response:**
  - 200 OK: List of photos in JSON format.
  - 500 Internal Server Error: Server error.

---

#### Delete Photo for a Task

- **Endpoint:** `/photos/<int:task_id>/<int:photo_id>/`
- **Method:** DELETE
- **Description:** Delete a photo for a specific task.
- **Authentication Required:** Yes
- **Response:**
  - 204 No Content: Photo deleted successfully.
  - 404 Not Found: Photo not found.
  - 500 Internal Server Error: Server error.

---

#### Upload Photos for a Task

- **Endpoint:** `/photos/`
- **Method:** POST
- **Description:** Upload photos for a specific task.
- **Authentication Required:** Yes
- **Request Parameters:**
  - `taskID` (int) - ID of the task.
  - `photos` (list of files) - Task photos.
- **Response:**
  - 201 Created: Photos uploaded successfully.
  - 400 Bad Request: Invalid request parameters.
  - 404 Not Found: Task not found.
  - 500 Internal Server Error: Server error.

---

### Search and Filter Endpoints

#### Search Tasks

- **Endpoint:** `/search_API/`
- **Method:** GET
- **Description:** Search tasks based on the provided query parameter.
- **Authentication Required:** Yes
- **Query Parameters:**
  - `query` (string) - Search query.
- **Response:**
  - 200 OK: List of matching tasks in JSON format.
  - 400 Bad Request: Invalid request parameters.

---

#### Filter Tasks

- **Endpoint:** `/filter_page/`
- **Method:** GET
- **Description:** Display the filter page.
- **Authentication Required:** Yes
- **Response:**
  - 200 OK: Filter page.

---

#### Edit Photo Page

- **Endpoint:** `/edit_photo_page/`
- **Method:** GET
- **Description:** Display the edit photo page.
- **Authentication Required:** Yes
- **Request Parameters:**
  - `taskID` (int) - ID of the task.
- **Response:**
  - 200 OK: Edit photo page.

---

#### Photos

- **Endpoint:** `/photos/`
- **Method:** GET
- **Description:** Retrieve all photos.
- **Authentication Required:** Yes
- **Response:**
  - 200 OK

: List of all photos in JSON format.

- 500 Internal Server Error: Server error.
