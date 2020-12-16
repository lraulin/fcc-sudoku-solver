const chai = require("chai");
const { expect } = chai;
const chaiHttp = require("chai-http");
const server = require("../server");

chai.use(chaiHttp);

describe("Functional Tests", () => {
  describe("POST /api/solve", () => {
    it("should return solution when given solvable puzzle", (done) => {
      const puzzle =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property(
            "solution",
            "135762984946381257728459613694517832812936745357824196473298561581673429269145378"
          );
          done();
        });
    });

    it("should return error when given not given puzzle", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send()
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("error", "Required field missing");
          done();
        });
    });

    it("should return error when puzzle length is not 81", (done) => {
      const puzzle =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.54258";

      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property(
            "error",
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });

    it("should return error when puzzle is not solvable", (done) => {
      const puzzle =
        "..9..5.1.85.4....2432.9.6..1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";

      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("error", "Puzzle cannot be solved");
          done();
        });
    });
  });
});
