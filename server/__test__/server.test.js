const mongoose = require("mongoose")
const app = require("../app")
const User = require("../Models/User") 
const supertest = require("supertest")

describe("Users API", () => {

    var savedUser

    beforeAll(function (done) {
        mongoose.connect(
          "mongodb://localhost:27017/projet0001",
          { useNewUrlParser: true, useUnifiedTopology: true },
          () => done()
        )
    })

    test("POST /users/", async () => {
        const user = {
            nom : "John",
            prenom : "Doe",
            email : "aa@aa.com",
            password : "11111111",
            cin : 11111111,
        }
        await supertest(app)
        .post("/users/")
        .send(user)
        .expect(200)
        .then(async (response) => {
            expect(response.body._id).toBeTruthy()
            expect(response.body.nom).toBe(user.nom)
            expect(response.body.prenom).toBe(user.prenom)
            expect(response.body.email).toBe(user.email)
            expect(response.body.password).toBe(user.password)
            expect(response.body.cin).toBe(user.cin)
            savedUser = response.body
        })
    })

    test("GET /users/", async () => {
        await supertest(app)
          .get("/users/")
          .expect(200)
          .then((response) => {
            expect(Array.isArray(response.body)).toBeTruthy()
            expect(response.body.length).toEqual(1)
            expect(response.body[0]._id).toBe(savedUser._id)
            expect(response.body[0].nom).toBe(savedUser.nom)
            expect(response.body[0].prenom).toBe(savedUser.prenom)
            expect(response.body[0].email).toBe(savedUser.email)
            expect(response.body[0].password).toBe(savedUser.password)
            expect(response.body[0].cin).toBe(savedUser.cin)
          })
      })

      test("GET /users/:id", async function(){
        await supertest(app)
        .get("/users/" + savedUser._id)
        .expect(200)
        .then((response) => {
            expect(response.body._id).toBe(savedUser._id) 
            expect(response.body.nom).toBe(savedUser.nom)
            expect(response.body.prenom).toBe(savedUser.prenom)
            expect(response.body.email).toBe(savedUser.email)
            expect(response.body.password).toBe(savedUser.password)
            expect(response.body.cin).toBe(savedUser.cin)
        })
      })

      test("should return 404 when the id doesn't exist", async function () {
        await supertest(app)
          .get("/users/33333")
          .expect(500)
          .then((response) => {
            expect(response.body.error).toBe(undefined)
          })
      })

      test("PUT /users/:id", async () => {
        const updatedUser = {
            nom : "Doe",
            prenom : "John",
            email : "aa@aa.com",
            password : "11111111",
            cin : 11111111,
        }
    
        await supertest(app)
          .put("/users/" + savedUser._id.toString())
          .send(updatedUser)
          .expect(200)
          .then(async (response) => {
            // Check the response
            expect(response.body._id).toBe(savedUser._id.toString())
            expect(response.body.nom).toBe(updatedUser.nom)
            expect(response.body.prenom).toBe(updatedUser.prenom)
            expect(response.body.email).toBe(updatedUser.email)
            expect(response.body.password).toBe(updatedUser.password)
            expect(response.body.cin).toBe(updatedUser.cin)
    
            const newUser = await User.findOne({ _id: response.body._id })
            expect(newUser).toBeTruthy()
            expect(newUser.nom).toBe(updatedUser.nom)
            expect(newUser.prenom).toBe(updatedUser.prenom)
            expect(newUser.email).toBe(updatedUser.email)
            expect(newUser.password).toBe(updatedUser.password)
            expect(newUser.cin).toBe(updatedUser.cin)
          })
      })

      test("DELETE /users/:id", async () => {
        await supertest(app)
          .delete("/users/" + savedUser._id.toString())
          .expect(200)
          .then(async () => {
            expect(
              await User.findOne({ _id: savedUser._id.toString() })
            ).toBeFalsy()
          })
      })



      afterAll(function (done) {
        mongoose.connection.db.dropDatabase(() => {
          mongoose.connection.close(() => done())
        })
      })

})

describe("Année Universitaire API", () => {

    var savedYear

    beforeAll(function (done) {
        mongoose.connect(
          "mongodb://localhost:27017/projet0001",
          { useNewUrlParser: true, useUnifiedTopology: true },
          () => done()
        )
    })

    test("POST /anneeUni/create/", async () => {
        const year = {
            annee : "2020/2021",
            dateDepot : new Date(2021,5,16)
        }
        await supertest(app)
        .post("/anneeUni/create/")
        .send(year)
        .expect(200)
        .then(async (response) => {
            expect(response.body._id).toBeTruthy()
            savedYear = response.body
        })
    })

    test("GET /anneeUni/list/", async () => {
        await supertest(app)
        .get("/anneeUni/list/")
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBeTruthy()
          expect(response.body.length).toEqual(1)
        })
    })


    afterAll(function (done) {
        mongoose.connection.db.dropDatabase(() => {
          mongoose.connection.close(() => done())
        })
    })

})