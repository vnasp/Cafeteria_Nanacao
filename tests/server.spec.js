const request = require("supertest")
const server = require("../index")
const { faker } = require('@faker-js/faker')
const { generateToken } = require('./utils.js/login.js')
require('dotenv').config()


describe("CRUD Operations", () => {

  it("GET code 200 with Array with min 1 Object", async () => {
    const response = await request(server)
      .get("/cafes")
      .send()
    expect(response.statusCode).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
    expect(response.body[0]).toBeInstanceOf(Object)
  })

  it("DELETE Get code 404 with not existing coffee ID", async () => {
    const idTestCafe = faker.string.alphanumeric()
    const token = generateToken()
    const response = await request(server).
      delete(`/cafes/${idTestCafe}`)
      .set("Authorization", `Bearer ${token}`)
      .send()
    expect(response.statusCode).toBe(404)
  })


  it("POST Get code 201 when add a new coffee", async () => {
    const cafePayload = {
      id: faker.string.numeric(2),
      nombre: faker.commerce.productName()
    }
    const response = await request(server)
      .post("/cafes")
      .send(cafePayload)
    expect(response.statusCode).toBe(201)
    expect(response.body).toContainEqual(cafePayload)
  })

  it("PUT Get code 400 when update a coffee, if you send an ID different to the payload ID", async () => {
    const idTestCafe = faker.string.alphanumeric()
    const cafePayload = {
      id: faker.string.numeric({min: 1, max:4}),
      nombre: faker.commerce.productName()
    }
    const response = await request(server)
      .put(`/cafes/${idTestCafe}`)
      .send(cafePayload)
    expect(response.statusCode).toBe(400)
  })

})