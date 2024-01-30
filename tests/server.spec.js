const request = require("supertest")
const server = require("../index")
const { faker } = require('@faker-js/faker')
const { generateToken } = require('./utils.js/login.js')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

// Load the unknown data to do the testing.
function loadData() {
  const fileRoute = path.join(__dirname, '../cafes.json')
  const cafesJSON = fs.readFileSync(fileRoute, 'utf8')
  const cafes = JSON.parse(cafesJSON)
  return cafes
}

// To be sure, load the max ID in the unknown data and sum 1.
function notExistingID(cafes) {
  const existingIds = cafes.map(c => c.id)
  const maxID = Math.max(...existingIds)
  return maxID + 1
}

// To select a random coffee from the unknown and mysterous data.
function randomCafe(cafes) {
  const randomIndex = Math.floor(Math.random() * cafes.length)
  return cafes[randomIndex]
}

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
    const idTestCafe = notExistingID(loadData())
    const token = generateToken()
    const response = await request(server).
      delete(`/cafes/${idTestCafe}`)
      .set("Authorization", `Bearer ${token}`)
      .send()
    expect(response.statusCode).toBe(404)
  })


  it("POST Get code 201 when add a new coffee", async () => {
    const nameTestCafe = faker.commerce.productName()
    const cafePayload = {
      id: notExistingID(loadData()),
      nombre: nameTestCafe
    }
    const response = await request(server)
      .post("/cafes")
      .send(cafePayload)
    expect(response.statusCode).toBe(201)
    expect(response.body).toContainEqual(cafePayload)
  })

  it("PUT Get code 400 when update a coffee, if you send an ID different to the payload ID", async () => {
    const idTestCafe = notExistingID(loadData())
    const cafes = loadData()
    const randomTestCafe = randomCafe(cafes)
    const response = await request(server)
      .put(`/cafes/${idTestCafe}`)
      .send(randomTestCafe)
    expect(response.statusCode).toBe(400)
  })

})