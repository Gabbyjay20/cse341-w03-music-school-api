# W06 Changes - Music School API

## Added
- Teachers collection CRUD routes at `/teachers` and `/teachers/:id`.
- Users collection CRUD routes at `/users` and `/users/:id`.
- Required-field validation on Teachers and Users POST/PUT operations.
- GitHub-session authentication on all Teachers and Users routes. Students and Lessons already require authentication.
- Swagger documentation for Teachers and Users.
- Four Node.js unit tests for the GET-all controller in each collection.

## Teacher fields
`firstName`, `lastName`, `email`, `phone`, `instrument`, `specialty` (all required strings).

## User fields for manual POST/PUT
`githubId`, `name`, `username`, `email`, `provider` (all required strings). The OAuth flow continues to create user records in this same collection.

## Run locally
1. Keep your own `.env` file locally; it is intentionally not included in this archive.
2. Run `npm install`.
3. Run `npm test` to execute the four controller unit tests.
4. Run `npm start` to start the API.
5. Sign in through `/auth/github` before testing protected endpoints.
6. Review Swagger at `/api-docs`.

## Important
This is a code update archive, not a deployment. Review and test locally, then commit and push the changes to the existing GitHub repository so Render can deploy them. Do not upload `.env` or `node_modules` to GitHub.
