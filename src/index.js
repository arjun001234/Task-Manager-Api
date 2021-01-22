const express = require('express');
const app = express();
const userRouter = require('./routers/user');
const router = require('./routers/task');
const Tasks = require('./models/taskmodel');
const User = require('./models/usermodel');
require('./db/mongoose');
const Cors = require('cors');

app.use(Cors());

const port = process.env.PORT;
   

app.use(express.json());
app.use(router);
app.use(userRouter);


app.listen(port,() => {
    console.log('Server is running on ' + port)
})

