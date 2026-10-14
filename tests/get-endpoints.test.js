const test = require("node:test");
const assert = require("node:assert/strict");

const { ObjectId } = require("mongodb");

const dbPath = require.resolve("../db/connect");

const testId = new ObjectId();
const sample = { _id: testId, sample: true };

let activeCollection;
let activeQuery;

const mockDatabase = {
  collection(name) {
    activeCollection = name;

    return {
      find() {
        return {
          toArray: async () => [sample],
        };
      },

      findOne(query) {
        activeQuery = query;
        return Promise.resolve(sample);
      },
    };
  },
};

require.cache[dbPath] = {
  id: dbPath,
  filename: dbPath,
  loaded: true,
  exports: {
    getDatabase: () => mockDatabase,
  },
};

const controllers = [
  {
    collection: "students",
    controller: require("../controllers/students"),
    getAll: "getAllStudents",
    getOne: "getSingleStudent",
  },
  {
    collection: "lessons",
    controller: require("../controllers/lessons"),
    getAll: "getAllLessons",
    getOne: "getSingleLesson",
  },
  {
    collection: "teachers",
    controller: require("../controllers/teachers"),
    getAll: "getAllTeachers",
    getOne: "getSingleTeacher",
  },
  {
    collection: "users",
    controller: require("../controllers/users"),
    getAll: "getAllUsers",
    getOne: "getSingleUser",
  },
];

function createResponse() {
  return {
    statusCode: undefined,
    body: undefined,

    status(code) {
      this.statusCode = code;
      return this;
    },

    json(body) {
      this.body = body;
      return this;
    },
  };
}

for (const item of controllers) {
  test(`GET all ${item.collection} returns HTTP 200 and records`, async () => {
    const res = createResponse();

    await item.controller[item.getAll]({}, res);

    assert.equal(activeCollection, item.collection);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, [sample]);
  });

  test(`GET ${item.collection} by ID returns HTTP 200 and record`, async () => {
    const res = createResponse();

    await item.controller[item.getOne](
      { params: { id: testId.toString() } },
      res
    );

    assert.equal(activeCollection, item.collection);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(activeQuery._id, testId);
    assert.deepEqual(res.body, sample);
  });
}