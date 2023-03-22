const ChecklistForm = require('../modals/checklist')
const fs = require('fs');
const moment = require('moment')



module.exports = {
    createChecklistForm:createChecklistForm,
    fillChecklistForm:fillChecklistForm,
    fileUploadInChecklistForm:fileUploadInChecklistForm
}


async function createChecklistForm(req,res) {
    try {

        const userRole = req.user.role
        const ChecklistFormData = req.body

        const dataId = moment().format('DDMMYYYYHHmmss')
        ChecklistFormData.checklistId = dataId

        if(userRole=="procurementManager"){

            if(ChecklistFormData.productCategory=="" || !(ChecklistFormData.productCategory) ||
              ChecklistFormData.statusByInspectionManager=="" || !(ChecklistFormData.statusByInspectionManager)){

                ChecklistFormData.productCategory="other"
                ChecklistFormData.statusByInspectionManager="processing"
              }

            const ChecklistData = await ChecklistForm(ChecklistFormData)
            await ChecklistData.save()

           // console.log('ChecklistData===', ChecklistData, ChecklistFormData)

            return res.json({
                statusCode: 200,
                status: "success",
                message: "checklist form created successfully",
                data:ChecklistData
            })

        }else {
            return res.json({
                statusCode: 400,
                status: "fail",
                message: "You are not allowed to create checklist form",
            })
        }
        
    } catch (error) {
        return res.json({
            statusCode: 500,
            status: "fail",
            message: "checklist form is not created",
            error:error
        })    
    }
}

async function fillChecklistForm(req,res) {

    try {
        const userRole = req.user.role
        const checklistId = req.body.id
        const ChecklistFormData = req.body

        if(userRole=="inspectionManager"){

            if(ChecklistFormData.productCategory=="" || !(ChecklistFormData.productCategory) ){

                return res.json({
                    statusCode: 400,
                    status: "fail",
                    message: "Please enter product category",
                })
            }else if(ChecklistFormData.productAvailable=="" || !(ChecklistFormData.productAvailable)){

                return res.json({
                    statusCode: 400,
                    status: "fail",
                    message: "Please enter product available",
                })
            }else if(ChecklistFormData.productDetails=="" || !(ChecklistFormData.productDetails)){

                return res.json({
                    statusCode: 400,
                    status: "fail",
                    message: "Please enter product details",
                })
            }else if(ChecklistFormData.productSummery=="" || !(ChecklistFormData.productSummery)){
                
                return res.json({
                    statusCode: 400,
                    status: "fail",
                    message: "Please enter product Summery",
                })
            }else if(ChecklistFormData.statusByInspectionManager=="" || !(ChecklistFormData.statusByInspectionManager)) {
                return res.json({
                    statusCode: 400,
                    status: "fail",
                    message: "Please enter own status",
                })
            }

            const updateChecklistData = await ChecklistForm.updateOne({ _id: checklistId},{
                 $set: { productCategory:ChecklistFormData.productCategory, 
                    productAvailable:ChecklistFormData.productAvailable,
                    productDetails:ChecklistFormData.productDetails,
                    productSummery:ChecklistFormData.productSummery,
                    statusByInspectionManager:ChecklistFormData.statusByInspectionManager }},
                { runValidators: true })

            return res.json({
                statusCode: 200,
                status: "success",
                message: "checklist form filled successfully",
                data:updateChecklistData
            })

        }else {
            return res.json({
                statusCode: 400,
                status: "fail",
                message: "You are not allowed to fill checklist form",
            })
        }
        
    } catch (error) {
        return res.json({
            statusCode: 500,
            status: "fail",
            message: "Checklist form is not filled",
            error:error
        })  
    }
}

async function fileUploadInChecklistForm(req,res) {

    try {

       const userRole = req.user.role
       const file = req.file
       const ChecklistFormId = req.body.id

      // console.log('file', req.file ) 

       if(userRole=="inspectionManager"){

        if(!file) {
            return res.json({
                statusCode: 200,
                status: "fail",
                message: "Please select a file",
            }) 
        } else {
            var newData = file.mimetype.split('/')
        }

       if(file.size>=2000000){
            return res.json({
               statusCode: 200,
                status: "fail",
                message: "Please select a file less than 2mb",
            }) 

        }
        //  else if(newData[0]!="image") {
        //     return res.json({
        //         statusCode: 200,
        //          status: "fail",
        //          message: "Please select a image file",
        //      })
        // }

        // console.log('file ---------', req.file.path)

        fs.readFile(req.file.path, (err, data) => {
            if (err) throw err; // Fail if the file can't be read.
            // var oldData = data;
            let str = data.toString('base64')
            var productFile = Buffer.from(str, 'base64');
    
            uploadFile(productFile,ChecklistFormId)
            
          });
    
           return res.json({
            statusCode: 200,
            status: "success",
            message: "File uploaded successfully",
        })

       }else {

        return res.json({
            statusCode: 400,
            status: "fail",
            message: "You are not allowed to upload file",
        }) 

       }
        
    } catch (error) {
        return res.json({
            statusCode: 500,
            status: "fail",
            message: "File is not uploaded",
            error:error
        }) 
    }
}


async function uploadFile(productFile, ChecklistFormId) {
    
    const fileData = productFile
    const ChecklistFormIds = ChecklistFormId
    try {

        const updateChecklistData = await ChecklistForm.updateOne({ _id: ChecklistFormIds},{
        $set: { productFile:fileData}},
        { runValidators: true })

       console.log('File uploaded successfully')
        
    } catch (error) {
        console.log('error',error)
    }

}
