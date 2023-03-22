var chai = require('chai');  
var should = chai.should();  // Using Should style
const app = require('../index')
const chaiHttp = require('chai-http')

const base_url = process.env.BASE_URL
chai.use(chaiHttp)


describe("Create order functionality", ()=>{

    let token;

    before((done) => {
        chai
        .request(base_url)
        .post('/userLogin')
        .send({email:"admin.email5@gmail.com", password:"123456"})
        .end((err, res) => {
            if (err) return done(err);
            token = res.body.data.token; 
        // console.log('token----------', token)
            done();
        });
    });

    it('Order created by procurement manager', (done)=>{

        chai
        .request(base_url)
        .post('/createOrder')
        .set({ Authorization: `Bearer ${token}` })
        .send({
            "orderByName":"order_2",
            "orderByEmail":"admin_nam@gmail.com",
            "orderByMobile":8726650277,
            "orderStatus":"processing"
        }).end((err,res)=>{
        // console.log('===', res)
            res.should.have.status(200)
            res.body.should.be.a("object")
            res.body.should.have.property("message")
            res.body.message.should.contain("Order is create successfully")
            done()

        })
    })

    describe("Order is not created because it's not authenticated user for order creation", ()=>{

        let token;

    before((done) => {
        chai
        .request(base_url)
        .post('/userLogin')
        .send({email:"admin.email1@gmail.com", password:"123456"})
        .end((err, res) => {
            if (err) return done(err);
            token = res.body.data.token; 
        // console.log('token----------', token)
            done();
        });
    });

    it('Order created by only procurement manager', (done)=>{

        chai
        .request(base_url)
        .post('/createOrder')
        .set({ Authorization: `Bearer ${token}` })
        .send({
            "orderByName":"order_2",
            "orderByEmail":"admin_nam@gmail.com",
            "orderByMobile":8726650277,
            "orderStatus":"processing"
        }).end((err,res)=>{
        // console.log('===', res)
            res.should.have.status(200)
            res.body.should.be.a("object")
            res.body.should.have.property("message")
            res.body.message.should.contain("You are not allowed to create order")
            done()

        })
    })

    })



})


describe("Check order status functionality", ()=>{

    let token;

    before((done) => {
        chai
        .request(base_url)
        .post('/userLogin')
        .send({email:"admin.email5@gmail.com", password:"123456"})
        .end((err, res) => {
            if (err) return done(err);
            token = res.body.data.token; 
        // console.log('token----------', token)
            done();
        });
    });

    it('Order status can check any user', (done)=>{

        chai
        .request(base_url)
        .post('/statusOfOrder')
        .set({ Authorization: `Bearer ${token}` })
        .send({
            "id":"63fb6887b34cca824efd7d51"
        }).end((err,res)=>{
        // console.log('===', res)
            res.should.have.status(200)
            res.body.should.be.a("object")
            res.body.should.have.property("message")
            res.body.message.should.contain("Order status is find successfully")
            done()

        })
    })

    it('You are not give right order id then you will not get status', (done)=>{

        chai
        .request(base_url)
        .post('/statusOfOrder')
        .set({ Authorization: `Bearer ${token}` })
        .send({
            "id":"63fb6887b34cca824efd7d52"
        }).end((err,res)=>{
        // console.log('===', res)
            res.should.have.status(200)
            res.body.should.be.a("object")
            res.body.should.have.property("message")
            res.body.message.should.contain("Order status is not found")
            done()

        })
    })

})

describe("Update order status functionality", ()=>{

    let token;

    before((done) => {
        chai
        .request(base_url)
        .post('/userLogin')
        .send({email:"admin.email5@gmail.com", password:"123456"})
        .end((err, res) => {
            if (err) return done(err);
            token = res.body.data.token; 
        // console.log('token----------', token)
            done();
        });
    });

    it('Update order status by admin, procurement manager and inspection manager ', (done)=>{

        chai
        .request(base_url)
        .post('/updateStatusOfOrder')
        .set({ Authorization: `Bearer ${token}` })
        .send({
            "id":"63fb6887b34cca824efd7d51",
            "orderStatus":"delivered"
        }).end((err,res)=>{
        // console.log('===', res)
            res.should.have.status(200)
            res.body.should.be.a("object")
            res.body.should.have.property("message")
            res.body.message.should.contain("Order status is update successfully")
            done()

        })
    })

    describe("Order status is not updated because it's not authenticated user ", ()=>{
        let token;

        before((done) => {
            chai
            .request(base_url)
            .post('/userLogin')
            .send({email:"admin.email1@gmail.com", password:"123456"})
            .end((err, res) => {
                if (err) return done(err);
                token = res.body.data.token; 
            // console.log('token----------', token)
                done();
            });
        });

        it('if you are not right user then not allowed to update order status', (done)=>{

            chai
            .request(base_url)
            .post('/updateStatusOfOrder')
            .set({ Authorization: `Bearer ${token}` })
            .send({
                "id":"63fb6887b34cca824efd7d51",
                "orderStatus":"delivered"
            }).end((err,res)=>{
            // console.log('===', res)
                res.should.have.status(200)
                res.body.should.be.a("object")
                res.body.should.have.property("message")
                res.body.message.should.contain("You are not allowed to update order status")
                done()
    
            })
        })


    })

})

describe("Link checklist form in orders, functionality", ()=>{

    let token;

    before((done) => {
        chai
        .request(base_url)
        .post('/userLogin')
        .send({email:"admin.email5@gmail.com", password:"123456"})
        .end((err, res) => {
            if (err) return done(err);
            token = res.body.data.token; 
        // console.log('token----------', token)
            done();
        });
    });

    it('Procurement manager can link checklist form in orders ', (done)=>{

        chai
        .request(base_url)
        .post('/linkChecklistFormInOrder')
        .set({ Authorization: `Bearer ${token}` })
        .send({
            "checklistId":"63fc913f17e82cd9d9b5b8a7",
            "orderId":"63fb6887b34cca824efd7d51"
        }).end((err,res)=>{
        // console.log('===', res)
            res.should.have.status(200)
            res.body.should.be.a("object")
            res.body.should.have.property("message")
            res.body.message.should.contain("Checklist form linked successfully")
            done()

        })
    })

    describe("Checklist form is not linked with order because it's not authenticated user ", ()=>{
        let token;

        before((done) => {
            chai
            .request(base_url)
            .post('/userLogin')
            .send({email:"admin.email1@gmail.com", password:"123456"})
            .end((err, res) => {
                if (err) return done(err);
                token = res.body.data.token; 
            // console.log('token----------', token)
                done();
            });
        });

        it('if you are not right user then not allowed to link checklist form in orders', (done)=>{

            chai
            .request(base_url)
            .post('/linkChecklistFormInOrder')
            .set({ Authorization: `Bearer ${token}` })
            .send({
                "checklistId":"63fc913f17e82cd9d9b5b8a7",
                "orderId":"63fb6887b34cca824efd7d51"
            }).end((err,res)=>{
            // console.log('===', res)
                res.should.have.status(200)
                res.body.should.be.a("object")
                res.body.should.have.property("message")
                res.body.message.should.contain("You are not allowed to link checklist form with order")
                done()
    
            })
        })


    })

})

