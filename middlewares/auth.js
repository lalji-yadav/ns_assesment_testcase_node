const jwt = require('jsonwebtoken')
const User = require('../modals/user')

const auth = async (req, res, next) => {

    try {

        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const userData = await User.findOne({ _id: decoded.id, 'token': token})

        if(!userData) {
        throw new Error('User is not found')
        }
           
        req.token = token
        req.user = userData

        next()
        
        
    } catch (e) {
        res.status(401).send({error: 'please authenticate'});
    }
}

module.exports = auth
