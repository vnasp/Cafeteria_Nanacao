const request = require("supertest")
const server = require("../index")
const { faker } = require('@faker-js/faker')

describe("CRUD Operations", () => {

  it("GET code 200 with Array with min 1 Object", async () => {
    const response = await request(server)
      .get("/cafes")
      .send()
    const status = response.statusCode
    const cafes = response.body
    expect(status).toBe(200)
    expect(cafes).toBeInstanceOf(Array)
    expect(cafes[0]).toBeInstanceOf(Object)
  })

  it("DELETE Get code 400 with ID", async () => {
    const jwt = "token"
    const idCafe = faker.string.numeric(3)
    const response = await request(server)
      .delete(`/cafes/${idCafe}`)
      .set("Authorization", jwt)
      .send()
    const status = response.statusCode
    expect(status).toBe(404)
  })

  it("POST Obteniendo un 201", async () => {
    const id = faker.string.numeric(3)
    const cafePayload = {
      id,
      nombre: "Expresso Doble"
    }
    const { body: cafes } = await request(server)
      .post("/cafes")
      .send(cafePayload)
    expect(cafes).toContainEqual(cafePayload)
  })

  it("PUT Obteniendo un 400", async () => {
    const idCafeTest = faker.string.numeric(3)
    const cafePayload = {
      id: 3,
      nombre: 'Mocacino'
    }
    const response = await request(server)
      .put(`/cafes/${idCafeTest}`)
      .send(cafePayload)
    const status = response.statusCode
    expect(status).toBe(400)
  })

})
