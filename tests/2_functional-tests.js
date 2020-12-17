const chai = require("chai");
const { expect } = chai;
const chaiHttp = require("chai-http");
const server = require("../server");

chai.use(chaiHttp);

describe("Functional Tests", () => {
  describe("POST /api/solve", () => {
    it("solves a puzzle with valid puzzle string: POST request to /api/solve", async () => {
      const puzzle =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      const res = await chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property(
        "solution",
        "135762984946381257728459613694517832812936745357824196473298561581673429269145378"
      );
    });

    it("Solve a puzzle with missing puzzle string: POST request to /api/solve", async () => {
      const res = await chai.request(server).post("/api/solve").send();
      expect(res).to.have.status(400);
      expect(res.body).to.have.property("error", "Required field missing");
    });

    it("Solve a puzzle with incorrect length: POST request to /api/solve", async () => {
      const puzzle =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.54258";

      const res = await chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle });
      expect(res).to.have.status(400);
      expect(res.body).to.have.property(
        "error",
        "Expected puzzle to be 81 characters long"
      );
    });

    it("Solve a puzzle with invalid characters: POST request to /api/solve", async () => {
      const puzzle =
        "1.5..2.84..X3.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      const res = await chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle });
      expect(res).to.have.status(400);
      expect(res.body).to.have.property(
        "error",
        "Invalid characters in puzzle"
      );
    });

    it("Solve a puzzle that cannot be solved: POST request to /api/solve", async () => {
      const puzzle =
        "..9..5.1.85.4....2432.9.6..1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";

      const res = await chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle });
      expect(res).to.have.status(400);
      expect(res.body).to.have.property("error", "Puzzle cannot be solved");
    });
  });

  describe("POST /api/solve", () => {
    it("Check a puzzle placement with all fields: POST request to /api/check", async () => {
      const puzzle =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      const coordinate = "A2";
      const value = 6;

      const res = await chai
        .request(server)
        .post("/api/check")
        .send({ puzzle, coordinate, value });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("valid", true);
    });

    it("Check a puzzle placement with single placement conflict: POST request to /api/check", async () => {
      const puzzle =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      const coordinate = "A7";
      const value = 6;

      const res = await chai
        .request(server)
        .post("/api/check")
        .send({ puzzle, coordinate, value });
      expect(res).to.have.status(200);
      expect(res.body).to.eql({ valid: false, conflict: ["column"] });
    });

    it("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", async () => {
      const puzzle =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      const coordinate = "A5";
      const value = 1;

      const res = await chai
        .request(server)
        .post("/api/check")
        .send({ puzzle, coordinate, value });
      expect(res).to.have.status(200);
      expect(res.body).to.eql({ valid: false, conflict: ["row", "column"] });
    });

    it("Check a puzzle placement with all placement conflicts: POST request to /api/check", async () => {
      const puzzle =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      const coordinate = "A5";
      const value = 1;

      const res = await chai
        .request(server)
        .post("/api/check")
        .send({ puzzle, coordinate, value });
      expect(res).to.have.status(200);
      expect(res.body).to.eql({
        valid: false,
        conflict: ["row", "column", "region"],
      });
    });

    it("Check a puzzle placement with missing required fields: POST request to /api/check", async () => {
      const puzzle =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      const value = 1;

      const res = await chai
        .request(server)
        .post("/api/check")
        .send({ puzzle, value });
      expect(res).to.have.status(200);
      expect(res.body).to.eql({ error: "Required field(s) missing" });
    });

    it("Check a puzzle placement with invalid characters: POST request to /api/check", async () => {
      const puzzle =
        "..9..5.1.85.4....2432...A..1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      const coordinate = "A5";
      const value = 1;

      const res = await chai
        .request(server)
        .post("/api/check")
        .send({ puzzle, coordinate, value });
      expect(res).to.have.status(200);
      expect(res.body).to.eql({ error: "Invalid characters in puzzle" });
    });

    it("Check a puzzle placement with incorrect length: POST request to /api/check", async () => {
      const puzzle =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..999";
      const coordinate = "A2";
      const value = 6;

      const res = await chai
        .request(server)
        .post("/api/check")
        .send({ puzzle, coordinate, value });
      expect(res).to.have.status(200);
      expect(res.body).to.eql({
        error: "Expected puzzle to be 81 characters long",
      });
    });

    it("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", async () => {
      const puzzle =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      const coordinate = "J2";
      const value = 6;

      const res = await chai
        .request(server)
        .post("/api/check")
        .send({ puzzle, coordinate, value });
      expect(res).to.have.status(200);
      expect(res.body).to.eql({
        error: "Invalid coordinate",
      });
    });

    it("Check a puzzle placement with invalid placement value: POST request to /api/check", async () => {
      const puzzle =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      const coordinate = "A2";
      const value = 10;

      const res = await chai
        .request(server)
        .post("/api/check")
        .send({ puzzle, coordinate, value });
      expect(res).to.have.status(200);
      expect(res.body).to.eql({
        error: "Invalid value",
      });
    });
  });
});
