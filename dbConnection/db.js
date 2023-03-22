const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URL).catch(error => handleError(error));
