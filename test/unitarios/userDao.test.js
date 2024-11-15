import Users from "../../src/dao/Users.dao.js";
import mongoose from "mongoose";
import { expect } from "chai";

mongoose.connect(`mongodb+srv://santiago:37x3byifjUG2dFeF@backend.f6prvy6.mongodb.net/proyectofinal`);


describe("Test UserDao", () => {
  const userDao = new Users();
  let userTest;

  
  before(() => {
    console.log("Comenzando tests");
  });

  
  beforeEach(() => {
    console.log("Ejecutandose un test individual");
  });

  
  it("Retornando todos los usuarios", async () => {
    const users = await userDao.get();
    expect(users).to.be.an("array");
    expect(users).to.be.not.an("object");
  });

  it("Crea y retorna usuario", async () => {
    const newUser = {
      first_name: "Juan Carlos",
      last_name: "Perez",
      email: "jcp@gamil.com",
      password: "123456",
      age: 35,
      birthDate: new Date(),
    };

    const user = await userDao.save(newUser);
    userTest = user;
    
    expect(user).to.be.an("object");
    expect(user).to.have.property("_id");
    expect(user.first_name).to.be.equal(newUser.first_name);
    expect(user.last_name).to.be.equal(newUser.last_name);
    expect(user.email).to.be.equal(newUser.email);
    expect(user.password).to.be.equal(newUser.password);
    expect(user.role).to.be.equal("user");

    expect(user).to.not.have.property("age");
    expect(user).to.not.have.property("birthDate");
    expect(user).to.not.be.null;
    expect(user).to.not.be.an("array");
  });

  it("Retorna un usuario por su id", async () => {
    const user = await userDao.getById(userTest._id);
    expect(user).to.be.an("object");
    expect(user).to.have.property("_id");
    expect(user.first_name).to.be.equal(userTest.first_name);
    expect(user.last_name).to.be.equal(userTest.last_name);
    expect(user.email).to.be.equal(userTest.email);
    expect(user.password).to.be.equal(userTest.password);
  });

  it("Actualiza un usuario", async () => {
    const updateData = {
      first_name: "Juan",
      password: "321",
    };

    const user = await userDao.update(userTest._id, updateData);
    expect(user).to.be.an("object");
    expect(user).to.have.property("_id");
    expect(user.first_name).to.be.equal("Juan");
    expect(user.last_name).to.be.equal(userTest.last_name);
    expect(user.email).to.be.equal(userTest.email);
    expect(user.password).to.be.equal("321");
  });

  it("Eliminar el usuario", async () => {
    await userDao.delete(userTest._id);
    const user = await userDao.getById(userTest._id);
    expect(user).to.be.null;
  })

  
  afterEach(() => {
    console.log("Test individual finalizado");
  });

  
  after(async () => {
    console.log("Tests ya finalizados");
    mongoose.disconnect();
  });
});