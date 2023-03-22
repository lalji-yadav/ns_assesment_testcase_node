const User = require('../modals/user')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports = {
    userLogin:userLogin,
    registerUser:registerUser,
    updateInspectionManager:updateInspectionManager
}


async function userLogin(req,res) {

    try {

         const loginData = req.body

         if(!(loginData.email) && !(loginData.mobile)){
            return res.status(401).json({
              statusCode:401,
              status: "failed",
              message: "Please enter email or password",
            });
         } else if(!loginData.password){
            return res.status(401).json({
              statusCode:401,
              status: "failed",
              message: "Please enter password.",
            });
         }

         const userData = await User.findOne({$or: [
            {
                $and:[
                    {email:loginData.email},
                    {$or:[{role:"admin"},{role:"client"},{role:"procurementManager"}]}
                ]
            },
            {
               $and:[
                {mobile:loginData.mobile},
                {role:"inspectionManager"}
               ]
            }
        ]})

        if(!userData) {
            return res.status(401).json({
              statusCode:401,
              status: "failed",
              message: "Invalid username or password.",
            });
          } else {
            let checkPassword = await bcrypt.compareSync(
              req.body.password,
              userData.password
            )

            if (!checkPassword) {
                return res.status(401).json({
                  statusCode:401,
                  status: "failed",
                  message: "Invalid username or password.",
                });
              } else {
                let authToken = await jwt.sign(
                  { email: userData.email, id: userData._id },
                  process.env.JWT_SECRET, { expiresIn: process.env.EXPIRESIN_TIME }
                );
                userData.token = authToken;

                //Update auth token at the login time in users collection.
                let updateData = await User.updateOne(
                  { _id: userData._id },
                  { $set: { token: authToken } }
                )

                return res.status(200).json({
                  status: "success",
                  statusCode: 200,
                  message: "User logged In successfully.",
                  data: userData,
                });
              } 
          }  
        
    } catch (error) {
        return res.json({
            statusCode: 401,
            status: "fail",
            message: "User is not authenticated",
            error:error
        })
        
    }
}

async function registerUser(req,res) {

    try {

        const userData = req.body
        const userRole = req.user.role

        if(userData.email=="" || !(userData.email)) {
          return res.json({
            statusCode: 400,
            status: "fail",
            message: "Please enter user email",
          })
        }else if(userData.mobile=="" || !(userData.mobile)) {

          return res.json({
            statusCode: 400,
            status: "fail",
            message: "Please enter user mobile number",
          })

        } else if(userData.password=="" || !(userData.password)) {

          return res.json({
            statusCode: 400,
            status: "fail",
            message: "Please enter user password",
          })

        }

        var myPassword = userData.password
        const hashPassword = bcrypt.hashSync(myPassword, saltRounds);
        userData.password = hashPassword

        if(userRole=="admin"){

            const data = await User(userData)
            await data.save()

            const token = jwt.sign({id: data._id.toString()}, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRESIN_TIME })
            const dataToken = await User.findByIdAndUpdate(data._id,{token:token},{new:true})

            return res.json({
                statusCode: 200,
                status: "success",
                message: "User register successfully",
                data: dataToken
            })

        } else if(userRole=="procurementManager") {
           if(userData.role=="client"){

            const data = await User(userData)
            await data.save()

            const token = jwt.sign({id: data._id.toString()}, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRESIN_TIME })
            const dataToken = await User.findByIdAndUpdate(data._id,{token:token},{new:true})

            return res.json({
                statusCode: 200,
                status: "success",
                message: "User register successfully",
                data: dataToken
            })

           } else if(userData.role=="inspectionManager"){

              const dataInspectionManager = await User.findOne({mobile:userData.mobile,email:userData.email})
              if(!dataInspectionManager) {

                const data = await User(userData)
                await data.save()
    
                const token = jwt.sign({id: data._id.toString()}, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRESIN_TIME })
                const dataToken = await User.findByIdAndUpdate(data._id,{token:token},{new:true})
    
                return res.json({
                    statusCode: 200,
                    status: "success",
                    message: "User register successfully",
                    data: dataToken
                })

              } else {

                return res.json({
                  statusCode: 400,
                  status: "fail",
                  message: "Already present contact admin for this",
                })

              }

           } else {

            return res.json({
              statusCode: 400,
              status: "fail",
              message: "You are not allowed to create procurement manager",
            })

           }

        }   
       
   } catch (error) {
       return res.json({
            statusCode: 500,
            status: "fail",
            message: "User is not register",
            error:error
        })
       
   }

}


async function updateInspectionManager(req,res){

  try {

    const userRole = req.user.role
    const id = req.body.userId
    const assignUnderValue = req.body.assignUnder

    if(userRole=="admin"){
      const data = await User.findOne({$and:[{_id:id},{assignUnder:assignUnderValue}]},{token:0})
      
      if(!data) {
        const updateInspectionManager = await User.findByIdAndUpdate(id,{assignUnder:assignUnderValue},{new:true})
        return res.json({
          statusCode: 200,
          status: "success",
          message: "Update inspection manager successfully",
          data: updateInspectionManager
        })

      } else {

        return res.json({
          statusCode: 200,
          status: "success",
          message: "Inspection manager already assign",
          data: data
        })
      }

    }else {
      return res.json({
        statusCode: 400,
        status: "fail",
        message: "You are not allowed to update",
      })
    }

  } catch (error) {

       return res.json({
            statusCode: 404,
            status: "fail",
            message: "User is not updated",
            error:error
        })
    
  }
}
