import request from "supertest";
import app from "../app";

describe("Invalide Path", () => {
  it("POST /", async () => {
    const res = await request(app).post("/").send();
    expect(res.statusCode).toEqual(404);
  });

  it("GET /validate", async () => {
    const res = await request(app).get("/").send();
    expect(res.statusCode).toEqual(404);
  });
});

describe("Invalid input", () => {
  it("No body", async () => {
    const res = await request(app).post("/validate").send();
    expect(res.statusCode).toEqual(400);
    expect(typeof res.body.errorMsg).toBe("string");
  });

  it("Code must be a string", async () => {
    const res = await request(app).post("/validate").send({ code: 1234 });
    expect(res.statusCode).toEqual(400);
    expect(typeof res.body.errorMsg).toBe("string");
  });

  it("Code length must be greater than or equal to 3", async () => {
    const res = await request(app)
      .post("/validate")
      .send({ code: "12" });
    expect(res.statusCode).toEqual(400);
    expect(typeof res.body.errorMsg).toBe("string");
  });

  it("Code must contain only the digits", async () => {
    const res = await request(app)
      .post("/validate")
      .send({ code: "1-2-3" });
    expect(res.statusCode).toEqual(400);
    expect(typeof res.body.errorMsg).toBe("string");
  });

  it("The last code shouldn't be 7", async () => {
    const res = await request(app)
      .post("/validate")
      .send({ code: "1234567" });
    expect(res.statusCode).toEqual(400);
    expect(typeof res.body.errorMsg).toBe("string");
  });
});

describe("Valid input", () => {
  it("3 length", async () => {
    const res = await request(app)
      .post("/validate")
      .send({ code: "123" });
    expect(res.statusCode).toEqual(200);
  });

  it("6 length", async () => {
    const res = await request(app)
      .post("/validate")
      .send({ code: "123456" });
    expect(res.statusCode).toEqual(200);
  });
});
