var chai = require('chai');  
// var assert = chai.assert;    // Using Assert style
// var expect = chai.expect;    // Using Expect style
var should = chai.should();  // Using Should style
const app = require('../index')
const chaiHttp = require('chai-http')

const base_url = process.env.BASE_URL
chai.use(chaiHttp)

describe("login functionality", ()=> {
    it('login user with correct username and password', (done)=>{
        chai.request(base_url).
        post('/userLogin').send({
            "email":"admin.email5@gmail.com",
            "password":"123456"
        }).end((err,res)=>{
            res.should.have.status(200)
            res.body.should.be.a("object")
            res.body.should.have.property("message")
            res.body.message.should.contain("User logged In successfully.")
            done()

        })
    })

    it('user is login with invalid credentials', (done)=>{
        chai.request(base_url).
        post('/userLogin').send({
            "email":"admin.email5@gmail.com",
            "password":"1234567"
        }).end((err,res)=>{
            res.should.have.status(401)
            res.body.should.be.a("object")
            res.body.should.have.property("message")
            res.body.message.should.contain("Invalid username or password.")
            done()

        })
    })   

    it('user is login with mobile number', (done)=>{
        chai.request(base_url).
        post('/userLogin').send({
            "mobile":"8726650277"
        }).end((err,res)=>{
            res.should.have.status(401)
            res.body.should.be.a("object")
            res.body.should.have.property("message")
            res.body.message.should.contain("Please enter password")
            done()

        })
    })

    it('user is login with email', (done)=>{
        chai.request(base_url).
        post('/userLogin').send({
            "email":"admin.email5@gmail.com",
        }).end((err,res)=>{
            res.should.have.status(401)
            res.body.should.be.a("object")
            res.body.should.have.property("message")
            res.body.message.should.contain("Please enter password")
            done()

        })
    })
    

    it('user is login with password', (done)=>{
        chai.request(base_url).
        post('/userLogin').send({
            "password":"123456"
        }).end((err,res)=>{
            res.should.have.status(401)
            res.body.should.be.a("object")
            res.body.should.have.property("message")
            res.body.message.should.contain("Please enter email or password")
            done()

        })
    })
    
    it('if user is inspection manager then please login with mobile number and password', (done)=>{
        chai.request(base_url).
        post('/userLogin').send({
            "mobile":"8726650294",
            "password":"123456"
        }).end((err,res)=>{
            res.should.have.status(200)
            res.body.should.be.a("object")
            res.body.should.have.property("message")
            res.body.message.should.contain("User logged In successfully.")
            done()

        })
    })


});
