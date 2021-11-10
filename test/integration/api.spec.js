const app = require("../../src/app");
const request = require('supertest');
const { connectToMongoDB } = require('../../src/mongodb')
const { disconnectFromMongoDB } = require('../../src/mongodb')

describe('::travel generator::', () => {
    beforeAll(() => {
        const connectionUri = `mongodb://${global.__TESTCONTAINERS_MONGO_IP__}:${global.__TESTCONTAINERS_MONGO_PORT_27017__}`
        connectToMongoDB(connectionUri)
        // `global.__TESTCONTAINERS_${CONFIG_KEY}_IP__`
        // `global.__TESTCONTAINERS_${CONFIG_KEY}_PORT_${CONFIG_PORT}__`
    })

    afterAll(() => {
        const connectionUri = `mongodb://${global.__TESTCONTAINERS_MONGO_IP__}:${global.__TESTCONTAINERS_MONGO_PORT_27017__}`
        disconnectFromMongoDB(connectionUri)
    })

    it("should set a container name", () => {
        expect(global.__TESTCONTAINERS_MONGO_NAME__).toBeDefined();
    });

    it("POST /new user sign-up",  (done) => {
        
         request(app)
            .post('/sign-up')
            .set('Accept', 'application/json')
            .send({username: 'test12', password: '123456', email: "test12@example.com"})
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.message).toEqual("User successfully registered!")
                done()
            })
    });

    it("POST /same user sign-up",  (done) => {
        
         request(app)
            .post('/sign-up')
            .set('Accept', 'application/json')
            .send({username: 'test12', password: '123456', email: "test12@example.com"})
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.message).toEqual("Failed! Username is already taken!")
                done()
            })
    });

    it("POST /same email sign-up",  (done) => {
        
         request(app)
            .post('/sign-up')
            .set('Accept', 'application/json')
            .send({username: 'test123', password: '123456', email: "test12@example.com"})
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.message).toEqual("Failed! Email is already taken!")
                done()
            })
    });


    it("POST /not a user try to sign-in",  (done) => {
        
         request(app)
            .post('/sign-in')
            .set('Accept', 'application/json')
            .send({username: 'tqtqttq', password: '123456'})
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.message).toEqual("User Not found.")
                done()
            })
    });


    var generatedToken = 'faketoken';
    it("POST /user sign-in",  (done) => {
        
         request(app)
            .post('/sign-in')
            .set('Accept', 'application/json')
            .send({username: 'test12', password: '123456'})
            .expect('Content-Type', /json/)
            .then(response => {
                generatedToken= response.body.accessToken;
                done()
            })
    });

    
    it("POST /invalid pass sign-in",  (done) => {
        
         request(app)
            .post('/sign-in')
            .set('Accept', 'application/json')
            .send({username: 'test12', password: '55566'})
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.message).toEqual("Invalid Password!")
                done()
            })
    });

    
    it("POST /succcesfull set-budget",  (done) => {
        
         request(app)
            .post('/set-budget')
            .set('Accept', 'application/json')
            .set('x-access-token', generatedToken)
            .send({budget: '123'})
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.message).toEqual("Budget entry complete!")
                done()
            })
    });

   
    it("POST /no auth set-budget",  (done) => {
        
         request(app)
            .post('/set-budget')
            .set('Accept', 'application/json')
            .send({budget: '123'})
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.message).toEqual("No token provided!")
                done()
            })
    });

    it("POST /success set-budget",  (done) => {
        
         request(app)
            .post('/set-budget')
            .set('Accept', 'application/json')
            .set('x-access-token', generatedToken)
            .send({budget: '5',})
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.message).toEqual("Budget entry complete!")
                done()
            })
    });

    it("POST /empty set-budget",  (done) => {
        
         request(app)
            .post('/set-budget')
            .set('Accept', 'application/json')
            .set('x-access-token', generatedToken)
            .send({budget: ''})
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.message).toEqual("Budget is not set.")
                done()
            })
    }); 

    it("POST /<3 city input generate-plan",  (done) => {
        
         request(app)
            .post('/generate-plan')
            .set('Accept', 'application/json')
            .set('x-access-token', generatedToken)
            .send({cityinput: ['istanbul', 'paris']})
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.message).toEqual("You have to choose 3-10 cities!")
                done()
            })
    });

    it("POST /wrong city name generate-plan",  (done) => {
        
         request(app)
            .post('/generate-plan')
            .set('Accept', 'application/json')
            .set('x-access-token', generatedToken)
            .send({cityinput: ['istanbulden', 'paris','roma']})
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.message).toEqual("Wrong city name input:istanbulden")
                done()
            })
    });

    it("POST /wrong city name generate-plan",  (done) => {
        
         request(app)
            .post('/generate-plan')
            .set('Accept', 'application/json')
            .set('x-access-token', generatedToken)
            .send({cityinput: ['istanbul', 'paris','roma']})
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.message).toEqual("Wrong city name input:roma")
                done()
            })
    });

    it("POST /successful set-budget",  (done) => {
        
         request(app)
            .post('/set-budget')
            .set('Accept', 'application/json')
            .set('x-access-token', generatedToken)
            .send({budget: '3000',})
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.message).toEqual("Budget entry complete!")
                done()
            })
    });


    it("POST /successful generate-plan",  (done) => {
        
         request(app)
            .post('/generate-plan')
            .set('Accept', 'application/json')
            .set('x-access-token', generatedToken)
            .send({cityinput: ['istanbul', 'paris','rome','barselona']})
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.message).toEqual("Travelplan generated!")
                done()
            })
    }); 
    
})
