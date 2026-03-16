const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/db");
const initializeDatabase = require("./config/initDb");
const scheduleBackup = require("./jobs/backupJob");
const authMiddleware = require("./middleware/authMiddleware");

const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const yearbookRoutes = require("./routes/yearbookRoutes");

const swaggerUi = require("swagger-ui-express");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Yearbook 25-06 API",
    version: "1.0.0",
    description: "Full-stack Digital Flipbook API for EON Class",
  },
  servers: [{ url: "http://localhost:5000" }],
  paths: {
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "User login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", example: "student@example.com" },
                  password: { type: "string", example: "password123" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Login successful" },
          403: { description: "Invalid credentials" },
        },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Registration successful" },
          409: { description: "Email already exists" },
        },
      },
    },
    "/api/yearbook/teachers": {
      get: {
        tags: ["Yearbook"],
        summary: "Get all teachers",
        responses: {
          200: {
            description: "List of all teachers",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      first_name: { type: "string" },
                      last_name: { type: "string" },
                      email: { type: "string" },
                      role: { type: "string" },
                      subject: { type: "string" },
                      quote: { type: "string" },
                      profile_picture_url: { type: "string" },
                      is_klassenlehrer: { type: "boolean" },
                    },
                  },
                },
              },
            },
          },
          500: { description: "Server error" },
        },
      },
    },
    "/api/yearbook/students": {
      get: {
        tags: ["Yearbook"],
        summary: "Get all students",
        responses: {
          200: {
            description: "List of all students",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      first_name: { type: "string" },
                      last_name: { type: "string" },
                      email: { type: "string" },
                      bio: { type: "string" },
                      profile_picture_url: { type: "string" },
                    },
                  },
                },
              },
            },
          },
          500: { description: "Server error" },
        },
      },
    },
    "/api/yearbook/messages/student/{id}": {
      get: {
        tags: ["Messages"],
        summary: "Get messages for a student",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Student ID",
          },
        ],
        responses: {
          200: {
            description: "List of messages for the student",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      content: { type: "string" },
                      author_name: { type: "string" },
                      created_at: { type: "string", format: "date-time" },
                    },
                  },
                },
              },
            },
          },
          500: { description: "Server error" },
        },
      },
    },
    "/api/yearbook/messages/teacher/{id}": {
      get: {
        tags: ["Messages"],
        summary: "Get messages for a teacher",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Teacher ID",
          },
        ],
        responses: {
          200: {
            description: "List of messages for the teacher",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      content: { type: "string" },
                      author_name: { type: "string" },
                      created_at: { type: "string", format: "date-time" },
                    },
                  },
                },
              },
            },
          },
          500: { description: "Server error" },
        },
      },
    },
    "/api/messages/student/{id}": {
      post: {
        tags: ["Messages"],
        summary: "Post message to a student (auth required)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Student ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  content: { type: "string", example: "Great work!" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Message created successfully" },
          400: { description: "Message cannot be empty" },
          401: { description: "Unauthorized" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/messages/teacher/{id}": {
      post: {
        tags: ["Messages"],
        summary: "Post message to a teacher (auth required)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Teacher ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  content: { type: "string", example: "Thank you for your teaching!" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Message created successfully" },
          400: { description: "Message cannot be empty" },
          401: { description: "Unauthorized" },
          500: { description: "Server error" },
        },
      },
    },
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          200: {
            description: "Server is running",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "LIVE AND READY" },
                  },
                },
              },
            },
          },
          500: { description: "Server is down" },
        },
      },
    },
  },
};

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/auth", authRoutes);
app.use("/api/messages", authMiddleware.verifyToken, messageRoutes);
app.use("/api/yearbook", yearbookRoutes);

app.get("/health", async (req, res) => {
  try {
    await db.query("SELECT NOW()");
    res.status(200).json({ status: "LIVE AND READY" });
  } catch (err) {
    res.status(500).json({ status: "DOWN", error: err.message });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
  initializeDatabase();
  scheduleBackup();
});