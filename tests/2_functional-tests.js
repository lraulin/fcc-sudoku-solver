const chai = require("chai");
const { expect } = chai;
const chaiHttp = require("chai-http");
const server = require("../server");

chai.use(chaiHttp);

describe("Functional Tests", () => {
  describe("POST /api/solve", () => {
    it("it should solve the puzzle", (done) => {
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
  });
});
