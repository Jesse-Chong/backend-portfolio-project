const request = require("supertest");
const app = require("../app");
const db = require("../db/dbConfig");

describe("Todo Controller", () => {
  // Before each test suite, reset the database and seed with initial data
  beforeEach(async () => {
    await db.none("DELETE FROM todo_tb WHERE true");
    await db.none("ALTER SEQUENCE todo_tb_id_seq RESTART");
    await db.none(`INSERT INTO todo_tb (todo_title, todo_description, todo_date, todo_istrue) VALUES
        ('Grocery shopping', 'Make sure to get ingredients for dinner', '2023-11-15', false),
        ('Clean bathroom', 'Clean the bathroom before mom gets home!', '2023-11-18', false),
        ('Get haircut', 'Dont forget your haircut appointment at 6pm', '2023-11-18', false),
        ('Feed dog', 'Don''t''know why you would forget but feed at 7 am and 7 pm', '2023-11-23', false),
        ('Son turns 1', 'You really have to make a reminder for your child''s'' birthday?', '2023-11-30', true);`);
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
            todo_title: "Grocery shopping",
            todo_description: "Make sure to get ingredients for dinner",
            todo_date: "2023-11-15T05:00:00.000Z",
            todo_istrue: false,
          },
          {
            id: 2,
            todo_title: "Clean bathroom",
            todo_description: "Clean the bathroom before mom gets home!",
            todo_date: "2023-11-18T05:00:00.000Z",
            todo_istrue: false,
          },
          {
            id: 3,
            todo_title: "Get haircut",
            todo_description: "Dont forget your haircut appointment at 6pm",
            todo_date: "2023-11-18T05:00:00.000Z",
            todo_istrue: false,
          },
          {
            id: 4,
            todo_title: "Feed dog",
            todo_description:
              "Don't'know why you would forget but feed at 7 am and 7 pm",
            todo_date: "2023-11-23T05:00:00.000Z",
            todo_istrue: false,
          },
          {
            id: 5,
            todo_title: "Son turns 1",
            todo_description:
              "You really have to make a reminder for your child's' birthday?",
            todo_date: "2023-11-30T05:00:00.000Z",
            todo_istrue: true,
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
            todo_date: "2023-12-01T05:00:00.000Z",
            todo_istrue: false,
          });

          expect(response.statusCode).toBe(400);
          expect(response.body.error).toEqual("Title is required");
        });

        it("returns 400 if todo_description is missing", async () => {
          const response = await request(app).post("/todo").send({
            todo_title: "New Task",
            todo_description: "",
            todo_date: "2023-12-01T05:00:00.000Z",
            todo_istrue: false,
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
          });

          expect(response.statusCode).toBe(400);
          expect(response.body.error).toEqual(
            "Invalid date format for todo_date. Must be in the format YYYY-MM-DD."
          );
        });
      });
    });

    describe('GET /todos/:id', () => {
        describe('GET', () => {
          it('with correct id - fetches the correct todo with the correct key/properties', async () => {
            const response = await request(app).get('/todo/1');
            const parsedRes = response.body;
      
            expect(parsedRes.todo_title).toEqual('Grocery shopping');
            expect(parsedRes.todo_description).toEqual('Make sure to get ingredients for dinner');
            expect(parsedRes.todo_date).toEqual('2023-11-15T05:00:00.000Z');
            expect(parsedRes.todo_istrue).toEqual(false);
          });
      
          it('with incorrect id - sets status to 404 and returns error key', async () => {
            const response = await request(app).get('/todo/98989898');
            expect(response.statusCode).toEqual(404);
            expect(response.body.error).toEqual('todo not found');
          });
        });
      });

      
  });
});
