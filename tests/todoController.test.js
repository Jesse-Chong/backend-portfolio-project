const request = require("supertest");
const app = require("../app");
const db = require("../db/dbConfig");

describe("Todo Controller", () => {
  // Before each test suite, reset the database and seed with initial data
  beforeEach(async () => {
    await db.none("DELETE FROM todo_tb WHERE true");
    await db.none("ALTER SEQUENCE todo_tb_id_seq RESTART");
    await db.none(`INSERT INTO todo_tb (todo_title, todo_description, todo_date, todo_istrue, todo_category) VALUES
    ('grocery shopping', 'make sure to get ingredients for dinner.', '2023-11-15', false, 'personal'),
    ('Clean bathroom', 'Clean the bathroom before mom gets home!', '2023-11-18', false, 'personal'),
    ('Get haircut', 'Dont forget your haircut appointment at 6pm', '2023-11-18', false, 'personal'),
    ('Feed dog', 'Don''t know why you would forget but feed at 7 am and 7 pm', '2023-11-23', false, 'work'),
    ('Son turns 1', 'You really have to make a reminder for your child''s birthday?', '2023-11-30', true, 'work');`);
  });

  // After all test suites, close the database connection
  afterAll(() => {
    db.$pool.end();
  });

  // Test GET /todos route
  describe("GET /todos", () => {
    describe("GET", () => {
      it("returns all todos", async () => {
        const expected = [
          {
            id: 1,
            todo_title: "grocery shopping",
            todo_description: "make sure to get ingredients for dinner.",
            todo_date: "2023-11-15",
            todo_istrue: false,
            todo_category: 'personal'
          },
          {
            id: 2,
            todo_title: "Clean bathroom",
            todo_description: "Clean the bathroom before mom gets home!",
            todo_date: "2023-11-18",
            todo_istrue: false,
            todo_category: 'personal'
          },
          {
            id: 3,
            todo_title: "Get haircut",
            todo_description: "Dont forget your haircut appointment at 6pm",
            todo_date: "2023-11-18",
            todo_istrue: false,
            todo_category: 'personal'
          },
          {
            id: 4,
            todo_title: "Feed dog",
            todo_description:
              "Don't know why you would forget but feed at 7 am and 7 pm",
            todo_date: "2023-11-23",
            todo_istrue: false,
            todo_category: 'work'
          },
          {
            id: 5,
            todo_title: "Son turns 1",
            todo_description:
              "You really have to make a reminder for your child's birthday?",
            todo_date: "2023-11-30",
            todo_istrue: true,
            todo_category: 'work'
          },
        ];

        const response = await request(app).get("/todo").expect(200);
        const parsedRes = response.body;
        expect(parsedRes).toEqual(expected);
      });
    });

    // Test POST /todos route
    describe("POST /todos", () => {
      describe("handling an improper create request", () => {
        it("returns 400 if todo_title is missing", async () => {
          const response = await request(app).post("/todo").send({
            todo_title: "",
            todo_description: "Description for the new task",
            todo_date: "2023-12-01",
            todo_istrue: false,
            todo_category: "work"
          });

          expect(response.statusCode).toBe(400);
          expect(response.body.error).toEqual("Title is required");
        });

        it("returns 400 if todo_description is missing", async () => {
          const response = await request(app).post("/todo").send({
            todo_title: "New Task",
            todo_description: "",
            todo_date: "2023-12-01",
            todo_istrue: false,
            todo_category: "work"
          });

          expect(response.statusCode).toBe(400);
          expect(response.body.error).toEqual("Description is required");
        });

        it("returns 400 if todo_date is not a proper date", async () => {
          const response = await request(app).post("/todo").send({
            todo_title: "New Task",
            todo_description: "Description for the new task",
            todo_date: "1-13-2023",
            todo_istrue: false,
            category: "work"
          });

          expect(response.statusCode).toBe(400);
          expect(response.body.error).toEqual(
            "Invalid date format for todo_date. Must be in the format YYYY-MM-DD."
          );
        });

        it("returns 400 if todo_category is not a proper category", async () => {
          const response = await request(app).post("/todo").send({
            todo_title: "New Task",
            todo_description: "Description for the new task",
            todo_date: "2023-12-01",
            todo_istrue: false,
            category: "invalid_category",
          });

          expect(response.statusCode).toBe(400);
          expect(response.body.error).toEqual(
            "Invalid category. Valid categories are 'personal' and 'work'."
          );
        });
      });
    });

    describe("GET /todos/:id", () => {
      describe("GET", () => {
        it("with correct id - fetches the correct todo with the correct key/properties", async () => {
          const response = await request(app).get("/todo/1");
          const parsedRes = response.body;

          expect(parsedRes.todo_title).toEqual("grocery shopping");
          expect(parsedRes.todo_description).toEqual(
            "make sure to get ingredients for dinner."
          );
          expect(parsedRes.todo_date).toEqual("2023-11-15");
          expect(parsedRes.todo_istrue).toEqual(false);
          expect(parsedRes.todo_category).toEqual('personal');
        });

        it("with incorrect id - sets status to 404 and returns error key", async () => {
          const response = await request(app).get("/todo/98989898");
          expect(response.statusCode).toEqual(404);
          expect(response.body.error).toEqual("todo not found");
        });
      });
    });

    describe("PUT /todos/:id", () => {
      describe("PUT", () => {
        describe("handling a proper update request", () => {
          it("can update a todo with all the fields", async () => {
            const response = await request(app).put("/todo/1").send({
              todo_title: "Updated Title",
              todo_description: "Updated Description",
              todo_date: "2023-12-01",
              todo_istrue: true,
              todo_category: 'work'
            });

            expect(response.statusCode).toBe(200);
            const updatedTodo = response.body;
            expect(updatedTodo.id).toEqual(1);
            expect(updatedTodo.todo_title).toEqual("Updated Title");
            expect(updatedTodo.todo_description).toEqual("Updated Description");
            expect(updatedTodo.todo_date).toEqual("2023-12-01T05:00:00.000Z");
            expect(updatedTodo.todo_istrue).toEqual(true);
            expect(updatedTodo.todo_category).toEqual('work');
          });
        });

        describe("handling an improper update request", () => {
          it("will return an error if todo_title is missing", async () => {
            const response = await request(app).put("/todo/1").send({
              todo_description: "Updated Description",
              todo_date: "2023-12-01",
              todo_istrue: true,
              todo_category: 'work'
            });

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toEqual("Title is required");
          });

          it("will return an error if todo_description is missing", async () => {
            const response = await request(app).put("/todo/1").send({
              todo_title: "Updated Title",
              todo_date: "2023-12-01",
              todo_istrue: true,
              todo_category: 'work'
            });

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toEqual("Description is required");
          });

          it("will return an error if todo_date is not in the proper format", async () => {
            const response = await request(app).put("/todo/1").send({
              todo_title: "Updated Title",
              todo_description: "Updated Description",
              todo_date: "1-13-2023",
              todo_istrue: true,
              todo_category: 'work'
            });

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toEqual(
              "Invalid date format for todo_date. Must be in the format YYYY-MM-DD."
            );
          });

          it("will return an error if todo_category is not a proper category", async () => {
            const response = await request(app).put("/todo/1").send({
              todo_title: "Updated Title",
              todo_description: "Updated Description",
              todo_date: "2023-12-01",
              todo_istrue: true,
              todo_category: 'invalid_category'
            });

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toEqual(
              "Invalid category. Valid categories are 'personal' and 'work'."
            );
          });
        });
      });
    });

    describe("DELETE /todos/:id", () => {
      describe("DELETE", () => {
        it("can delete a todo with a valid id", async () => {
          const response = await request(app).delete("/todo/1");

          expect(response.statusCode).toBe(200);
          expect(response.body.message).toEqual("todo deleted successfully");

          const deletedTodoResponse = await request(app).get("/todo/1");
          expect(deletedTodoResponse.statusCode).toBe(404);
          expect(deletedTodoResponse.body.error).toEqual("todo not found");
        });

        it("returns a 404 error if trying to delete a non-existing todo", async () => {
          const response = await request(app).delete("/todo/999");

          expect(response.statusCode).toBe(404);
          expect(response.body.error).toEqual("todo not found");
        });
      });
    });
  });
});
