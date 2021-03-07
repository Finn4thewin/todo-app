import express from 'express';

import todoRoutes from './routes/todoList';

const app = express();
const port = 8000;

app.use(express.json());

app.use('/', todoRoutes);

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});