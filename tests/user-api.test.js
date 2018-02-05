const supertest = require("supertest");
const { app, server } = require("../index");
const api = supertest(app);
const User = require("../models/user");
const {
  format,
  usersInDb,
  initializeDatabase,
  blogsInDb,
  createNewUser
} = require("./test-helper");

describe("when there is initially one user at db", async () => {
  beforeEach(async () => {
    await User.remove({});
    const user = new User({ username: "root", password: "sekret" });
    await user.save();
  });

  test("POST /api/users succeeds with a fresh username", async () => {
    const usersBeforeOperation = await usersInDb();

    const newUser = createNewUser("username", "password", "name", true);

    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const usersAfterOperation = await usersInDb();
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length + 1);
    const usernames = usersAfterOperation.map(u => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("POST /api/users fails with an existing username", async () => {
    const usersBeforeOperation = await usersInDb();

    const newUser = createNewUser("root", "password", "name", true);

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400);

    const usersAfterOperation = await usersInDb();
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length);
    expect(response.body.error).toBe("username taken");
  });

  test("POST /api/users fails with an password length of less than three", async () => {
    const usersBeforeOperation = await usersInDb();

    const newUser = createNewUser("username", "pw", "name", true);

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400);

    const usersAfterOperation = await usersInDb();
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length);
    expect(response.body.error).toBe("password too short");
  });

  test("POST /api/users defaults user to be an adult if no value is provided", async () => {
    const usersBeforeOperation = await usersInDb();

    const newUser = createNewUser("username", "password", "name");

    await api
      .post("/api/users")
      .send(newUser)
      .expect(200);

    const usersAfterOperation = await usersInDb();
    expect(usersAfterOperation.find(u => u.username === "username").adult).toBe(
      true
    );
  });
});

afterAll(() => {
  server.close();
});
