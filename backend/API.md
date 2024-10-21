# MyApp API Documentation

<!-- Detta API ger funktioner för användarhantering, verktygshantering och logghantering. Dokumentationen beskriver de tillgängliga endpoints, deras syften, de förväntade parametrarna och svaren.
Användarhantering:
POST /register: Registrerar en ny användare. Tar username, email och password i body.
POST /login: Loggar in en användare. Tar email och password i body.
POST /change-password: Ändrar en användares lösenord. Tar currentPassword och newPassword i body.
GET /profile: Hämtar en användares profil, kräver en autentiseringstoken i headers.
Verktygshantering (Tools):
GET /tools: Hämtar alla tillgängliga verktyg.
GET /tools/search?q=query: Söker efter verktyg med ett specifikt namn.
Loggar (Logs):
POST /logs: Skapar en ny loggpost.
GET /logs: Hämtar alla loggar för den inloggade användaren.
PUT /logs/:id: Uppdaterar en befintlig loggpost.
DELETE /logs/:id: Tar bort en loggpost.
GET /logs/stats: Hämtar statistik över loggar (t.ex. medelvärde för humör och sömn).
Administrationshantering:
GET /admin/users: Hämtar användare med paginering (kräver admin).
DELETE /admin/users/:id: Tar bort en användare (kräver admin) -->
## Bas-URL
https://feelstate.netlify.app

## Autentisering
Många endpoints kräver en JWT-token för autentisering. Token ska inkluderas i `Authorization`-headern i varje begäran:


---

## Endpoints

### User 

#### Register User
- **URL**: `/register`
- **Method**: POST

**Body**:
```json
{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpassword"
  }
  ```


**Response:**

*201 Created*
  ```json
  {
  "message": "User registered successfully",
  "token": "<your-jwt-token>"
}
```

*400 Bad Request*
```json
{
  "message": "All fields are required"
}
```
___

#### Login User
- **URL**: `/login`
- **Method**: POST

**Body**:
```json
{
  "email": "test@example.com",
  "password": "testpassword"
}
```
**Response:**

*200 OK*
```json
{
  "token": "<your-jwt-token>"
}
```
*400 Bad Request*:
```json
{
  "message": "Invalid credentials"
}
```
___

#### Change Password
- **URL**: `/change-password`
- **Method**: POST

 **Header**
```json
{
  "Authorization": "Bearer <your-jwt-token>"
}
```

**Body**
```json
  {
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

**Response:**
*200 OK*
```json
{
  "message": "Password changed successfully"
}

```

___

#### Get User Profile
- **URL**: `/profile`
- **Method**: GET

 **Header**

```json
{
  "Authorization": "Bearer <your-jwt-token>"
}

```
**Response:**

*200 OK*
```json
{
  "_id": "userId",
  "username": "testuser",
  "email": "test@example.com",
  "savedTools": []
}
```
*401 Unauthorized*
```json
{
  "message": "No token provided"
}
```
___
___
### Tools

#### Get all tools
- **URL**: `/tools`
- **Method**: GET

**Response:**
*200 OK*
```json
[
  {
    "_id": "toolId1",
    "name": "Tool 1",
    "description": "Description of Tool 1"
  },
  {
    "_id": "toolId2",
    "name": "Tool 2",
    "description": "Description of Tool 2"
  }
]
```


#### Get tools by name
- **URL**: `/tools/search?q=query`
- **Method**: GET

**Response:**
*200 OK*
```json
[
  {
    "_id": "toolId1",
    "name": "Search Result Tool",
    "description": "Tool that matches search"
  }
]
```

___
___
### Logs

#### Create Log post
- **URL**: `/logs`
- **Method**: POST

**Headers**:
```json
{
  "Authorization": "Bearer <your-jwt-token>"
}
```

**Body**:
```json
{
  "mood": 7,
  "sleepHours": 8,
  "note": "Feeling good today."
}
```


**Response:**

*201 Created*
```json
{
  "message": "Log created successfully",
  "log": {
    "_id": "logId1",
    "mood": 7,
    "sleepHours": 8,
    "note": "Feeling good today.",
    "userId": "userId"
  }
}

```


#### Get logs for currently logged in user
- **URL**: `/logs`
- **Method**: GET

**Headers**:
```json
{
  "Authorization": "Bearer <your-jwt-token>"
}
```


**Response:**

*200 OK*
```json
[
  {
    "_id": "logId1",
    "mood": 7,
    "sleepHours": 8,
    "note": "Feeling good today."
  }
]
```

#### Update an existing log post on :id

- **URL**: `/logs/:id`
- **Method**: PUT

**Headers**:
```json
{
  "Authorization": "Bearer <your-jwt-token>"
}
```

**Body**:
```json
{
  "mood": 6,
  "sleepHours": 7,
  "note": "Feeling better today."
}
```

**Response**:
*200 OK*
```json
{
  "message": "Log updated successfully",
  "log": {
    "_id": "logId1",
    "mood": 6,
    "sleepHours": 7,
    "note": "Feeling better today."
  }
}
```

#### Delete specific log post by :id

- **URL**: `/logs/:id`
- **Method**: DELETE

**Headers**:
```json
{
  "Authorization": "Bearer <your-jwt-token>"
}
```

**Response**:
*200 OK*
```json
{
  "message": "Log deleted successfully"
}

```

*404 Not Found*
```json
{
  "message": "Log not found or user not authorized"
}

```

*401 Unauthorized*
```json
{
   "message": "Unauthorized"

}

```

### Stats
#### Get stats based on user log posts

- **URL**: `/logs/stats`
- **Method**: GET

**Headers**:
```json
{
  "Authorization": "Bearer <your-jwt-token>"
}
```

**Response**:
*200 OK*
```json
[
  {
    "_id": "2023-10-15",
    "moodAvg": 6.5,
    "sleepAvg": 7.5
  }
]
```

### Admin
#### Get registered users in list if user is admin
- **URL**: `/admin/users`
- **Method**: GET

**Headers**:
```json
{
  "Authorization": "Bearer <admin-jwt-token>"
}
```

**Response**:


*200 OK*
```json
{
  "users": [
    {
      "_id": "userId1",
      "username": "testuser",
      "email": "test@example.com"
    }
  ],
  "totalUsers": 100
}
```

#### Delete a user as admin
- **URL**: `/admin/users/:id`
- **Method**: DELETE

**Headers**:
```json
{
  "Authorization": "Bearer <admin-jwt-token>"
}
```

**Response**:


*200 OK*
```json
{
  "message": "User deleted successfully"
}

```