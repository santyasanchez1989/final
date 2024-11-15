import request from "supertest";
import app from "../app.js"; // Importa tu aplicación principal

describe("Adoptions Router Tests", () => {
  
  it("should return all adoptions", async () => {
    const response = await request(app).get("/adoptions");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array); 
  });

  
  it("should return a specific adoption by ID", async () => {
    const aid = "someValidAdoptionId"; 
    const response = await request(app).get(`/adoptions/${aid}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", aid); 
  });

  
  it("should create a new adoption", async () => {
    const uid = "validUserId";
    const pid = "validPetId"; 

    const response = await request(app).post(`/adoptions/${uid}/${pid}`).send({
      adoptionDetails: {
        date: "2024-11-15",
        location: "Animal Shelter",
      },
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "Adoption created successfully");
  });
});