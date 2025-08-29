const express = require('express');
const userRouter = require('./routes/userRoutes');
const taskRouter = require('./routes/taskRoutes');
const projectRouter = require('./routes/projectRoutes');
const cors = require('cors');
const app = express();
const globalErrorHandler = require('./controllers/errorController');

app.use(cors());
app.use(express.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/projects', projectRouter);

app.use(globalErrorHandler);

module.exports = app;
