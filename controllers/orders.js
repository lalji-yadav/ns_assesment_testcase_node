const Order = require('../modals/orders')
const moment = require('moment')


module.exports = {
    createOrder:createOrder,
    statusOfOrder:statusOfOrder,
    updateStatusOfOrder:updateStatusOfOrder,
    linkChecklistFormInOrder:linkChecklistFormInOrder
}


async function createOrder(req,res) {

    try { 
        const userRole = req.user.role 
        const order = req.body
        
        const dataId = moment().format('DDMMYYYYHHmmss')
        order.orderNumber = dataId

        if(userRole=="procurementManager"){

            const orderData = await Order(order)
            await orderData.save()

            return res.json({
                statusCode: 200,
                status: "success",
                message: "Order is create successfully",
                data:orderData
            })

        }else {
            return res.json({
                statusCode: 400,
                status: "fail",
                message: "You are not allowed to create order ",
            })
        }
        
    } catch (error) {

        return res.json({
            statusCode: 500,
            status: "fail",
            message: "Order is not created",
            error:error
        })
        
    }
}

async function statusOfOrder(req,res) {

    try {
        const orderId = req.body.id
        const userRole = req.user.role

        if(userRole=="admin" || userRole=="procurementManager" || userRole=="inspectionManager" || userRole=="client"){
            const orderStatus = await Order.findOne({_id:orderId},{orderStatus:1})

            if(orderStatus){

                return res.json({
                    statusCode: 200,
                    status: "success",
                    message: "Order status is find successfully",
                    data:orderStatus
                })

            } else {

                return res.json({
                    statusCode: 400,
                    status: "fail",
                    message: "Order status is not found",
                    data:orderStatus
                })
            }

        } else {

            return res.json({
                statusCode: 400,
                status: "fail",
                message: "You are not allowed to see order status",
            })
        }

        
    } catch (error) {

        return res.json({
            statusCode: 500,
            status: "fail",
            message: "Order status is not found",
            error:error
        })
        
    }
}

async function updateStatusOfOrder(req,res) {

    try {

        const userRole = req.user.role
        const orderId = req.body.id
        const orderStatus = req.body.orderStatus

        if(userRole=="admin" || userRole=="procurementManager" || userRole=="inspectionManager"){
            const updateOrder = await Order.updateOne({ _id: orderId},{ $set: { orderStatus:orderStatus }},
                    { runValidators: true })

            return res.json({
                statusCode: 200,
                status: "success",
                message: "Order status is update successfully",
                data:updateOrder
            })
                        
        } else {

            return res.json({
                statusCode: 400,
                status: "fail",
                message: "You are not allowed to update order status",
            })
        }
  
    } catch (error) {

        return res.json({
            statusCode: 500,
            status: "fail",
            message: "Order status is not updated",
            error:error
        })
        
    }
}

async function linkChecklistFormInOrder(req,res) {

    try {
        const userRole = req.user.role
        const orderId = req.body.orderId
        const checklistId = req.body.checklistId

        if(userRole=="procurementManager"){

            const updateChecklistData = await Order.updateOne({ _id: orderId},{
                $set: { checklistFormId:checklistId}},
                { runValidators: true })
    
               // console.log('updateChecklistData======',orderId,checklistId, updateChecklistData)    
    
            return res.json({
                statusCode: 200,
                status: "success",
                message: "Checklist form linked successfully",
                data:updateChecklistData
            })

        }else {
            return res.json({
                statusCode: 400,
                status: "fail",
                message: "You are not allowed to link checklist form with order.",
            })
        }
        
    } catch (error) {

        return res.json({
            statusCode: 500,
            status: "fail",
            message: "Checklist form  is not linked",
            error:error
        })
        
    }
}
