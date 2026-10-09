const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const dbPath = require.resolve("../db/connect");
const sample = [{ _id: "test-id", sample: true }];
let activeCollection;
require.cache[dbPath] = { id: dbPath, filename: dbPath, loaded: true, exports: { getDatabase: () => ({ collection: (name) => { activeCollection = name; return { find: () => ({ toArray: async () => sample }) }; } }) } };
const controllers = [
  ["students", require("../controllers/students"), "getAllStudents"],
  ["lessons", require("../controllers/lessons"), "getAllLessons"],
  ["teachers", require("../controllers/teachers"), "getAllTeachers"],
  ["users", require("../controllers/users"), "getAllUsers"],
];
for (const [collection, controller, method] of controllers) {
  test(`GET ${collection} controller returns HTTP 200 and records`, async () => {
    let statusCode;
    let responseBody;
    const res = { status(code) { statusCode = code; return this; }, json(body) { responseBody = body; return this; } };
    await controller[method]({}, res);
    assert.equal(activeCollection, collection);
    assert.equal(statusCode, 200);
    assert.deepEqual(responseBody, sample);
  });
}
