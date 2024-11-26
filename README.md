
# Task and Subtask Management API

This project is a RESTful API built with Node.js, Express, and MongoDB that allows users to manage tasks and subtasks. It includes features like authentication, task creation, task deletion, task update, pagination, and soft deletion.

---

## Features

### User Authentication
- **JWT Authentication**: Secures endpoints, ensuring only authenticated users can access their tasks and subtasks.

### Task Management
- **Create Task**: Add a new task with a title, description, due date, and priority.
- **Get Tasks**: Retrieve all tasks for the logged-in user with support for:
  - **Filters**: Priority, due date, and status (`TODO`/`DONE`).
  - **Pagination**: Controlled with `page` and `limit` query parameters.
- **Update Task**: Modify a task's due date or status (`TODO`/`DONE`).
- **Soft Delete Task**: Mark tasks as deleted while preserving data integrity.
- **Cascading Changes**: Automatically updates or deletes associated subtasks.

### Subtask Management
- **Create Subtask**: Add a subtask linked to a specific task.
- **Get Subtasks**: Retrieve all subtasks with support for:
  - **Filters**: Filter subtasks by task ID.
- **Update Subtask**: Change the status of a subtask (0 = incomplete, 1 = complete).
- **Soft Delete Subtask**: Mark a subtask as deleted while preserving data integrity.

---

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or hosted)

### Steps

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd task-management-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root and configure the following:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/taskManagement
   JWT_SECRET=your_secret_key
   ```

4. Start the application:
   ```bash
   npm start
   ```

5. Access the API at:
   ```
   http://localhost:5000/api
   ```

---

## API Endpoints

### Authentication
- **JWT Token**: Add the token in the `Authorization` header as `Bearer <token>` for all requests.

---

### Task Endpoints

| Endpoint                  | Method | Description                                   |
|---------------------------|--------|-----------------------------------------------|
| `/api/tasks/create`              | POST   | Create a new task.                           |
| `/api/tasks/get`              | GET    | Get all tasks for the logged-in user.        |
| `/api/tasks/update/:id`          | PUT    | Update a task's due date or status.          |
| `/api/tasks/delete/:id`          | DELETE | Soft delete a task and its subtasks.         |

---

### Subtask Endpoints

| Endpoint                  | Method | Description                                   |
|---------------------------|--------|-----------------------------------------------|
| `/api/subtasks/create`           | POST   | Create a new subtask for a task.             |
| `/api/subtasks/get`           | GET    | Get all subtasks for the logged-in user.     |
| `/api/subtasks/update/:id`       | PUT    | Update a subtask's status.                   |
| `/api/subtasks/delete/:id`       | DELETE | Soft delete a subtask.                       |

---

### Input Validations

The API uses **express-validator** for input validation.

#### Example Validations:
1. **Task Creation**:
   - Title is required.
   - Description is required.
   - Due date must be in ISO format.

2. **Subtask Creation**:
   - Task ID must be a valid MongoDB ObjectId.

---

## Examples

### 1. Create a Task
**Request**:  
`POST /api/tasks`  
**Body**:
```json
{
  "title": "Complete Project",
  "description": "Finish the backend API",
  "due_date": "2024-11-30T00:00:00.000Z",
  "priority": "High"
}
```

**Response**:
```json
{
  "success": true,
  "task": {
    "_id": "64c9fcd12345",
    "title": "Complete Project",
    "description": "Finish the backend API",
    "due_date": "2024-11-30T00:00:00.000Z",
    "priority": "High",
    "status": "TODO"
  }
}
```

---

### 2. Get All Tasks
**Request**:  
`GET /api/tasks?priority=HIGH&page=1&limit=5`  

**Response**:
```json
{
  "success": true,
  "tasks": [
    {
      "_id": "64c9fcd12345",
      "title": "Complete Project",
      "description": "Finish the backend API",
      "due_date": "2024-11-30T00:00:00.000Z",
      "priority": "High",
      "status": "TODO"
    }
  ]
}
```

---

### 3. Create a Subtask
**Request**:  
`POST /api/subtasks`  
**Body**:
```json
{
  "task_id": "64c9fcd12345",
  "title": "Implement Controllers",
  "description": "Write and test controllers"
}
```

**Response**:
```json
{
  "success": true,
  "subtask": {
    "_id": "64c9fcd67890",
    "task_id": "64c9fcd12345",
    "title": "Implement Controllers",
    "description": "Write and test controllers",
    "status": 0
  }
}
```

---

## Error Handling

- **Custom Validation Errors**: User-friendly error messages for invalid inputs.

---

## Future Enhancements

2. Implement sorting for tasks by due date or priority.
3. Create a frontend for better user interaction.

---

## License
