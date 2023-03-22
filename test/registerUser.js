var chai = require('chai');  
var should = chai.should();  // Using Should style
const app = require('../index')
const chaiHttp = require('chai-http')

const base_url = process.env.BASE_URL
chai.use(chaiHttp)


describe("User register functionality", ()=> {

    let token;

        before((done) => {
            chai
            .request(base_url)
            .post('/userLogin')
            .send({email:"admin.email5@gmail.com", password:"123456"})
            .end((err, res) => {
                if (err) return done(err);
                token = res.body.data.token; 
               // console.log('token----', token)
                done();
            });
        });


    it('User register with correct data', (done)=>{

        chai
        .request(base_url)
        .post('/registerUser')
        .set({ Authorization: `Bearer ${token}` })
        .send({
                "name":"Abcd",
                "email":"lal124@gmail.com",
                "mobile":"8726650297",
                "password":"123456",
                "role":"inspectionManager"
        }).end((err,res)=>{
           // console.log('===', res)
            res.should.have.status(200)
            res.body.should.be.a("object")
            res.body.should.have.property("message")
            res.body.message.should.contain("User register successfully")
            done()

        })
    })

    it('User register without email', (done)=>{

        chai
        .request(base_url)
        .post('/registerUser')
        .set({ Authorization: `Bearer ${token}` })
        .send({
                "name":"Abcd",
                "email":"",
                "mobile":"8726650295",
                "password":"123456",
                "role":"inspectionManager"
        }).end((err,res)=>{
           // console.log('===', res)
            res.should.have.status(200)
            res.body.should.be.a("object")
            res.body.should.have.property("message")
            res.body.message.should.contain("Please enter user email")
            done()

        })
    })

    it('User register without mobile number', (done)=>{

        chai
        .request(base_url)
        .post('/registerUser')
        .set({ Authorization: `Bearer ${token}` })
        .send({
                "name":"Abcd",
                "email":"lal122@gmail.com",
                "mobile":"",
                "password":"123456",
                "role":"inspectionManager"
        }).end((err,res)=>{
           // console.log('===', res)
            res.should.have.status(200)
            res.body.should.be.a("object")
            res.body.should.have.property("message")
            res.body.message.should.contain("Please enter user mobile number")
            done()

        })
    })

    it('User register without password', (done)=>{

        chai
        .request(base_url)
        .post('/registerUser')
        .set({ Authorization: `Bearer ${token}` })
        .send({
                "name":"Abcd",
                "email":"lal122@gmail.com",
                "mobile":"8726650295",
                "password":"",
                "role":"inspectionManager"
        }).end((err,res)=>{
           // console.log('===', res)
            res.should.have.status(200)
            res.body.should.be.a("object")
            res.body.should.have.property("message")
            res.body.message.should.contain("Please enter user password")
            done()

        })
    })

    it('User register with duplicate input data', (done)=>{
        chai
        .request(base_url)
        .post('/registerUser')
        .set({ Authorization: `Bearer ${token}` })
        .send({
                "name":"Abcd",
                "email":"lal119@gmail.com",
                "mobile":"8726650292",
                "password":"123456",
                "role":"inspectionManager"
        }).end((err,res)=>{
           // console.log('res--==', res)
            res.should.have.status(200)
            res.body.should.be.a("object")
            res.body.should.have.property("message")
            res.body.message.should.contain("Already present contact admin for this")
            done()

        })
    })

    it('Procurement manager can not create procurement manager', (done)=>{
        chai
        .request(base_url)
        .post('/registerUser')
        .set({ Authorization: `Bearer ${token}` })
        .send({
                "name":"Abcd",
                "email":"lal119@gmail.com",
                "mobile":"8726650292",
                "password":"123456",
                "role":"procurementManager"
        }).end((err,res)=>{
           // console.log('res--==', res)
            res.should.have.status(200)
            res.body.should.be.a("object")
            res.body.should.have.property("message")
            res.body.message.should.contain("You are not allowed to create procurement manager")
            done()

        })
    })

}) 

//--------------- Update inspection manager test case------------------------------

describe("Update inspection manager", ()=>{

   let token;

    before((done) => {
        chai
        .request(base_url)
        .post('/userLogin')
        .send({email:"admin.email@gmail.com", password:"123456"})
        .end((err, res) => {
            if (err) return done(err);
            token = res.body.data.token;
        // console.log('token--', token)
            done();
        });
    });

    it('Update inspection manager in which person under working', (done)=>{

        chai
        .request(base_url)
        .post('/updateInspectionManager')
        .set({ Authorization: `Bearer ${token}` })
        .send({
            "userId":"63f9b9078f18369878b6e994",
            "assignUnder":"inspection manager2"
        }).end((err,res)=>{
        // console.log('===', res)
            res.should.have.status(200)
            res.body.should.be.a("object")
            res.body.should.have.property("message")
            res.body.message.should.contain("Update inspection manager successfully")
            done()

        })
    })

    it('Inspection manager already assign under any manager', (done)=>{

        chai
        .request(base_url)
        .post('/updateInspectionManager')
        .set({ Authorization: `Bearer ${token}` })
        .send({
            "userId":"63fa202d806098f828500585",
            "assignUnder":"insp14"
        }).end((err,res)=>{
        // console.log('===', res)
            res.should.have.status(200)
            res.body.should.be.a("object")
            res.body.should.have.property("message")
            res.body.message.should.contain("Inspection manager already assign")
            done()

        })
    })


    describe("Update inspection manager", ()=>{

        let token;

        before((done) => {
            chai
            .request(base_url)
            .post('/userLogin')
            .send({email:"admin.email1@gmail.com", password:"123456"})
            .end((err, res) => {
                if (err) return done(err);
                token = res.body.data.token; 
            // console.log('token----', token)
                done();
            });
        });

        it('Only admin allowed to update', (done)=>{

            chai
            .request(base_url)
            .post('/updateInspectionManager')
            .set({ Authorization: `Bearer ${token}` })
            .send({
                "userId":"63fa202d806098f828500585",
                "assignUnder":"insp14"
            }).end((err,res)=>{
            // console.log('===', res)
                res.should.have.status(200)
                res.body.should.be.a("object")
                res.body.should.have.property("message")
                res.body.message.should.contain("You are not allowed to update")
                done()

            })
        })



    })

})
