import { expect } from "chai";
import supertest from "supertest";

const request = supertest("http://localhost:8080/api/adoptions");
const petRequest = supertest("http://localhost:8080/api/pets");
const userRequest = supertest("http://localhost:8080/api/users");

describe("Test de integración de adopciones", () => {
  let testUser, testPet, testAdoption;

  beforeEach(async () => {
    // Crear un usuario de prueba
    const newUser = {
      first_name: "FirstN",
      last_name: "LastN",
      email: "usertest@example.com",
      password: "password",
    };

    const userResponse = await userRequest.post("/").send(newUser);
    // Verificar que la respuesta de usuario contiene payload
    expect(userResponse.status).to.equal(201);
    testUser = userResponse.body.payload;
    console.log("testUser:", testUser);

    // Crear una mascota de prueba
    const newPet = {
      name: "Pet Test",
      specie: "Gato",
      birthDate: "10/10/2023",
      image: "petimage.jpg",
    };

    const petResponse = await petRequest.post("/").send(newPet);
    // Verificar que la respuesta de mascota contiene payload
    expect(petResponse.status).to.equal(201);
    testPet = petResponse.body.payload;
    console.log("testPet:", testPet);
  });

  it("[POST] /api/adoptions/:uid/:pid - Debe crear una nueva adopción", async () => {
    if (!testUser || !testPet) {
      throw new Error("No se pudo encontrar usuario o mascota para la adopción");
    }

    const { status, body } = await request.post(`/${testUser._id}/${testPet._id}`);

    expect(status).to.be.equal(201);
    expect(body.payload).to.be.an("object");
    expect(body.payload.owner).to.be.equal(testUser._id);
    expect(body.payload.pet).to.be.equal(testPet._id);
    testAdoption = body.payload; // Guardar la adopción creada para futuras pruebas
  });

  it("[PUT] /api/adoptions/:aid - Debe actualizar una adopción", async () => {
    // Verifica que la adopción haya sido creada correctamente
    if (!testAdoption || !testAdoption._id) {
      throw new Error("No se pudo encontrar adopción para actualizar");
    }

    const updatedAdoption = {
      status: "Adopted", 
    };

    const { status, body } = await request.put(`/${testAdoption._id}`).send(updatedAdoption);

    expect(status).to.be.equal(200);
    expect(body.payload.status).to.be.equal("Adopted");

    // Confirmamos que el cambio se ha reflejado correctamente
    const updatedAdoptionResponse = await request.get(`/${testAdoption._id}`);
    expect(updatedAdoptionResponse.body.payload.status).to.be.equal("Adopted");
  });

  it("[DELETE] /api/adoptions/:aid - Debe eliminar una adopción", async () => {
    // Verifica que la adopción haya sido creada correctamente
    if (!testAdoption || !testAdoption._id) {
      throw new Error("No se pudo encontrar adopción para eliminar");
    }

    const { status, body } = await request.delete(`/${testAdoption._id}`);

    // Verificaciones
    expect(status).to.be.equal(200);
    expect(body.message).to.be.equal("Adoption deleted");

    // Verificar que la adopción ha sido eliminada
    const adoptionNotFoundResponse = await request.get(`/${testAdoption._id}`);
    expect(adoptionNotFoundResponse.status).to.be.equal(404); 
  });
});