## ExpressJs Boilerplate

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Nodemon](https://img.shields.io/badge/NODEMON-%23323330.svg?style=for-the-badge&logo=nodemon&logoColor=%BBDEAD)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![Mocha](https://img.shields.io/badge/-mocha-%238D6748?style=for-the-badge&logo=mocha&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Prettier](https://img.shields.io/badge/prettier-%23F7B93E.svg?style=for-the-badge&logo=prettier&logoColor=black)

### Explanation of Key Folders and Files

- **`config/`**: Contains configuration files like database settings and environment variables.
- **`controllers/`**: Holds the logic to process requests and generate responses (e.g., `userController.js`).
- **`middlewares/`**: Custom middlewares like authentication and error handling.
- **`models/`**: Database models, like `userModel.js`, typically used with ORMs like Mongoose or Sequelize.
- **`routes/`**: API route definitions, organizing all available API endpoints.
- **`services/`**: Business logic and reusable functionality, separate from controllers.
- **`utils/`**: Utility/helper functions and logging setups.
- **`validations/`**: Validation logic for request payloads.
- **`.env`**: Used for environment variables (never committed to Git).
- **`.gitignore`**: Specifies files and directories to be excluded from version control.
- **`app.js`**: Initializes the Express app, middleware, and routes.
- **`server.js`**: The entry point that starts the server.
- **`README.md`**: Documentation for the project.

## Dependencies:

- **`bcryptjs`**: For hashing passwords.
- **`cors`**: Enables Cross-Origin Resource Sharing (CORS).
- **`dotenv`**: Loads environment variables from a .env file.
- **`express`**: The Express.js framework for building the API.
- **`express-validator`**: Middleware for validating user input.
- **`jsonwebtoken`**: For creating and verifying JWT tokens.
- **`mongoose`**: For working with MongoDB.
- **`morgan`**: HTTP request logger for Express.js.

## DevDependencies: 
Tools for development and testing:
- **`chai`**: For assertions in tests.
- **`eslint`**: For linting your code (enforcing coding standards).
- **`mocha`**: A testing framework.
- **`nodemon`**: Restarts the server automatically when files change (used in development).
- **`sinon`**: Useful for stubbing, spying, and mocking in tests.
- **`supertest`**: For testing your HTTP endpoints.