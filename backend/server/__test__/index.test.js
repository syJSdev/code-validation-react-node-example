import request from "supertest";
import app from "../app";

describe("POST /validate", () => {
  it("invalidate input: no body", async () => {
    const res = await request(app).post("/validate").send();
    expect(res.statusCode).toEqual(400);
    expect(typeof res.body.errorMsg).toBe("string");
  });

  it("invalidate input: codes attribute is not array", async () => {
    const res = await request(app).post("/validate").send({ codes: "" });
    expect(res.statusCode).toEqual(400);
    expect(typeof res.body.errorMsg).toBe("string");
  });

  it("invalidate input: codes count must be 6", async () => {
    const res = await request(app)
      .post("/validate")
      .send({ codes: [1, 2, 3] });
    expect(res.statusCode).toEqual(400);
    expect(typeof res.body.errorMsg).toBe("string");
  });

  it("invalidate input: code must be 0-9", async () => {
    const res = await request(app)
      .post("/validate")
      .send({ codes: [-1, 1, 1, 1, 1, 1] });
    expect(res.statusCode).toEqual(400);
    expect(typeof res.body.errorMsg).toBe("string");
  });

  it("invalidate input: last code should not be 7", async () => {
    const res = await request(app)
      .post("/validate")
      .send({ codes: [1, 1, 1, 1, 1, 7] });
    expect(res.statusCode).toEqual(400);
    expect(typeof res.body.errorMsg).toBe("string");
  });

  it("invalidate input: last code should not be \"7\"", async () => {
    const res = await request(app)
      .post("/validate")
      .send({ codes: [1, 1, 1, 1, 1, "7"] });
    expect(res.statusCode).toEqual(400);
    expect(typeof res.body.errorMsg).toBe("string");
  });

  it("validate input: numbers", async () => {
    const res = await request(app)
      .post("/validate")
      .send({ codes: [1, 2, 3, 4, 5, 6] });
    expect(res.statusCode).toEqual(200);
  });

  it("validate input: numbers with string format", async () => {
    const res = await request(app)
      .post("/validate")
      .send({ codes: ["1", "2", "3", "4", "5", "6"] });
    expect(res.statusCode).toEqual(200);
  });
});

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
