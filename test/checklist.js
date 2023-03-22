var chai = require('chai');  
var should = chai.should();  // Using Should style
const app = require('../index')
const chaiHttp = require('chai-http')
const fs = require('fs');
const path = require("path");

const base_url = process.env.BASE_URL
chai.use(chaiHttp)


describe("Create checklist form functionality", ()=>{

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

    it('Create checklist form by procurement manager', (done)=>{

        chai
        .request(base_url)
        .post('/createChecklistForm')
        .set({ Authorization: `Bearer ${token}` })
        .send({
            "productCategory":"",
            "productAvailable":true,
            "productDetails":"",
            "productSummery":"admin_name",
        }).end((err,res)=>{
        // console.log('===', res)
            res.should.have.status(200)
            res.body.should.be.a("object")
            res.body.should.have.property("message")
            res.body.message.should.contain("checklist form created successfully")
            done()

        })
    })

    describe("Checklist form is not created because it's not authenticated user for checklist form creation", ()=>{

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

        it('Checklist form created by only procurement manager', (done)=>{

            chai
            .request(base_url)
            .post('/createChecklistForm')
            .set({ Authorization: `Bearer ${token}` })
            .send({
                "productCategory":"",
                "productAvailable":true,
                "productDetails":"",
                "productSummery":"admin_name",
            }).end((err,res)=>{
            // console.log('===', res)
                res.should.have.status(200)
                res.body.should.be.a("object")
                res.body.should.have.property("message")
                res.body.message.should.contain("You are not allowed to create checklist form")
                done()

            })
        })

    })
})




describe("Fill checklist form functionality", ()=>{

    let token;

    before((done) => {
        chai
        .request(base_url)
        .post('/userLogin')
        .send({mobile:"8726650287", password:"123456"})
        .end((err, res) => {
            if (err) return done(err);
            token = res.body.data.token; 
            // console.log('token----------', token)
            done();
        });
    });

    it('Fill checklist form by inspection manager', (done)=>{

        chai
        .request(base_url)
        .post('/fillChecklistForm')
        .set({ Authorization: `Bearer ${token}` })
        .send({
            "id":"63fc913f17e82cd9d9b5b8a7",
            "productCategory":"eatable",
            "productAvailable":true,
            "productDetails":["aaaa"],
            "productSummery":"aa",
            "statusByInspectionManager":"done"
        }).end((err,res)=>{
         // console.log('===', res)
            res.should.have.status(200)
            res.body.should.be.a("object")
            res.body.should.have.property("message")
            res.body.message.should.contain("checklist form filled successfully")
            done()

        })
    })

    describe("Checklist form is not fill because it's not authenticated user for checklist form fill", ()=>{

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

        it('Checklist form filled by only inspection manager', (done)=>{

            chai
            .request(base_url)
            .post('/fillChecklistForm')
            .set({ Authorization: `Bearer ${token}` })
            .send({
                "id":"63fc913f17e82cd9d9b5b8a7",
                "productCategory":"eatable",
                "productAvailable":true,
                "productDetails":["aaaa"],
                "productSummery":"aa",
                "statusByInspectionManager":"done"
            }).end((err,res)=>{
            // console.log('===', res)
                res.should.have.status(200)
                res.body.should.be.a("object")
                res.body.should.have.property("message")
                res.body.message.should.contain("You are not allowed to fill checklist form")
                done()

            })
        })

    })
})


describe("File upload in checklist form functionality", ()=>{

    let token;

    before((done) => {
        chai
        .request(base_url)
        .post('/userLogin')
        .send({mobile:"8726650287", password:"123456"})
        .end((err, res) => {
            if (err) return done(err);
            token = res.body.data.token; 
            // console.log('token----------', token)
            done();
        });
    });

    it('File upload in checklist form by inspection manager', (done)=>{

        chai
        .request(base_url)
        .post('/fileUploadInChecklistForm')
        .set({ Authorization: `Bearer ${token}`})
        .field({id: '63fdee466973a9e2ecddf5a8'})
        .attach('productFile', fs.readFileSync(path.resolve(__dirname, "../uploadsFile/1678459027007-988787299-LaljiSign.jpg")), 'test-file.jpg')
        .end((err,res)=>{
         // console.log('===', res)
            res.should.have.status(200)
            res.body.should.be.a("object")
            res.body.should.have.property("message")
            res.body.message.should.contain("File uploaded successfully")
            done()

        })
    })

    it('If we are not choose file and hit the file upload api', (done)=>{

        chai
        .request(base_url)
        .post('/fileUploadInChecklistForm')
        .set({ Authorization: `Bearer ${token}`})
        .field({id: '63fdee466973a9e2ecddf5a8'})
        // .attach('productFile', fs.readFileSync(path.resolve(__dirname, "../uploadsFile/1678459027007-988787299-LaljiSign.jpg")), 'test-file.jpg')
        .end((err,res)=>{
         // console.log('===', res)
            res.should.have.status(200)
            res.body.should.be.a("object")
            res.body.should.have.property("message")
            res.body.message.should.contain("Please select a file")
            done()

        })
    })

    it('If we choose file size grater than 2mb', (done)=>{

        chai
        .request(base_url)
        .post('/fileUploadInChecklistForm')
        .set({ Authorization: `Bearer ${token}`})
        .field({id: '63fdee466973a9e2ecddf5a8'})
        .attach('productFile', fs.readFileSync(path.resolve(__dirname, "../uploadsFile/2835351-1007-laljiyadavsign.jpg")), 'test-file2mb.jpg')
        .end((err,res)=>{
         // console.log('===', res)
            res.should.have.status(200)
            res.body.should.be.a("object")
            res.body.should.have.property("message")
            res.body.message.should.contain("Please select a file less than 2mb")
            done()

        })
    })

    describe("If user is not inspection manager then not allowed to upload file", ()=>{

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

        it('If user is not inspection manager then not allowed to upload file', (done)=>{

            chai
            .request(base_url)
            .post('/fileUploadInChecklistForm')
            .set({ Authorization: `Bearer ${token}`})
            .field({id: '63fdee466973a9e2ecddf5a8'})
            .attach('productFile', fs.readFileSync(path.resolve(__dirname, "../uploadsFile/1678459027007-988787299-LaljiSign.jpg")), 'test-file.jpg')
            .end((err,res)=>{
             // console.log('===', res)
                res.should.have.status(200)
                res.body.should.be.a("object")
                res.body.should.have.property("message")
                res.body.message.should.contain("You are not allowed to upload file")
                done()
    
            })
        })

    })
})
