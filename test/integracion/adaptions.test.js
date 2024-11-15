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
    console.log("Respuesta de creación de usuario:", userResponse.body);

    expect(userResponse.status).to.equal(201);
    expect(userResponse.body).to.have.property("user");
    testUser = userResponse.body.user;
    expect(testUser).to.have.property('_id');

    const newPet = {
      name: "Pet Test",
      specie: "Gato",
      birthDate: "10/10/2023",
      image: "petimage.jpg",
    };

    const petResponse = await petRequest.post("/").send(newPet);
    console.log("Respuesta de creación de mascota:", petResponse.body);

    expect(petResponse.status).to.equal(201);
    expect(petResponse.body).to.have.property("pet");
    testPet = petResponse.body.pet;
    expect(testPet).to.have.property('_id');

    if (!testUser || !testPet) {
      throw new Error("No se pudo crear el usuario o la mascota");
    }
  });

  it("[POST] /api/adoptions/:uid/:pid - Debe crear una nueva adopción", async () => {
    if (!testUser || !testPet) {
      throw new Error("No se pudo encontrar usuario o mascota para la adopción");
    }
  
    const { status, body } = await request.post(`/${testUser._id}/${testPet._id}`);
    console.log("Respuesta de adopción:", body);  // Depuración
  
    expect(status).to.be.equal(201);
    expect(body).to.have.property("payload"); // Verifica 'payload'
    expect(body.payload).to.have.property("pet");  // Verifica 'pet' dentro de 'payload'
    expect(body.payload.pet).to.have.property('_id');  // Verifica que el ID de la mascota esté presente
    expect(body.payload.pet._id).to.equal(testPet._id);  // Compara con el ID de la mascota
    expect(body.payload.pet.name).to.equal(testPet.name); // Verifica el nombre de la mascota
    expect(body.payload.pet.specie).to.equal(testPet.specie); // Verifica la especie
  
    testAdoption = body.payload;  // Guardar la adopción creada para futuras pruebas
  });

  it("[PUT] /api/adoptions/:aid - Debe actualizar una adopción", async () => {
    if (!testAdoption || !testAdoption._id) {
      throw new Error("No se pudo encontrar adopción para actualizar");
    }

    const updatedAdoption = {
      status: "Adopted", 
    };

    const { status, body } = await request.put(`/${testAdoption._id}`).send(updatedAdoption);
    expect(status).to.be.equal(200);
    expect(body).to.have.property("adoption");
    expect(body.adoption.status).to.be.equal("Adopted");

    const updatedAdoptionResponse = await request.get(`/${testAdoption._id}`);
    expect(updatedAdoptionResponse.body.adoption.status).to.be.equal("Adopted");
  });

  it("[DELETE] /api/adoptions/:aid - Debe eliminar una adopción", async () => {
    if (!testAdoption || !testAdoption._id) {
      throw new Error("No se pudo encontrar adopción para eliminar");
    }

    const { status, body } = await request.delete(`/${testAdoption._id}`);
    expect(status).to.be.equal(200);
    expect(body.message).to.be.equal("Adoption deleted");

    const adoptionNotFoundResponse = await request.get(`/${testAdoption._id}`);
    expect(adoptionNotFoundResponse.status).to.be.equal(404);
  });
});
