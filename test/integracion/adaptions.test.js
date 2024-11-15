import { expect } from "chai";
import supertest from "supertest";

const request = supertest("http://localhost:8080/api/adoptions");
const userRequest = supertest("http://localhost:8080/api/users");
const petRequest = supertest("http://localhost:8080/api/pets");

describe("Test de integración de adopciones", () => {
  let testUser, testPet, testAdoption;

  beforeEach(async () => {
    const newUser = {
      first_name: "FirstN",
      last_name: "LastN",
      email: `usertest-${Date.now()}@example.com`,
      password: "password",
    };

    const userResponse = await userRequest.post("/").send(newUser);
    testUser = userResponse.body.user;

    const newPet = {
      name: "Pet Test",
      specie: "Gato",
      birthDate: "10/10/2023",
      image: "petimage.jpg",
    };

    const petResponse = await petRequest.post("/").send(newPet);
    testPet = petResponse.body.pet;
  });

  it("[POST] /api/adoptions/:uid/:pid - Debe crear una nueva adopción", async () => {
    const { status, body } = await request.post(`/${testUser._id}/${testPet._id}`);
    expect(status).to.equal(201);
    expect(body).to.have.property("payload");
    expect(body.payload).to.have.property("owner").that.equals(testUser._id);
    expect(body.payload).to.have.property("pet").that.equals(testPet._id);
    testAdoption = body.payload;
  });
});