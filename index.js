const express = require('express')
const app = express()
require('./dbConnection/db')
require('dotenv').config()

const multer  = require('multer')
//const upload = multer({ dest: 'uploadsFile/' })

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploadsFile/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + '-'+ file.originalname)
    }
  })
  
const upload = multer({ storage: storage })

const auth = require('./middlewares/auth')
const userController = require('./controllers/user')
const orderController = require('./controllers/orders')
const checklistFormController = require('./controllers/checklist')


const port = process.env.PORT

app.use(express.json())
app.use(express.static('uploadsFile'))
app.use(express.static(__dirname + '/uploadsFile'));
// app.use(express.static("public"))

app.post('/userLogin', userController.userLogin)
app.post('/registerUser',auth, userController.registerUser)
app.post('/updateInspectionManager',auth, userController.updateInspectionManager)


app.post('/createOrder',auth, orderController.createOrder)
app.post('/statusOfOrder',auth, orderController.statusOfOrder)
app.post('/updateStatusOfOrder',auth, orderController.updateStatusOfOrder)
app.post('/linkChecklistFormInOrder',auth, orderController.linkChecklistFormInOrder)

app.post('/createChecklistForm',auth, checklistFormController.createChecklistForm)
app.post('/fillChecklistForm',auth, checklistFormController.fillChecklistForm)
app.post('/fileUploadInChecklistForm',auth,upload.single("productFile"), checklistFormController.fileUploadInChecklistForm)



app.listen(port,()=>{
    console.log('server created successfully',port)
})
