import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import taskRoutes from './routes/tasks';
import path from 'path';
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const logRequest: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} request at ${req.url}`);
  next();
}
app.use(logRequest);

app.use('/tasks', taskRoutes);

const logPageRequest: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  console.log(`Hello Page request: ${req.method} request at ${req.url}`);
  next();
}
app.get('/hello',logPageRequest, (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express!');
});

//Static Pages
app.use('/', express.static(path.resolve(__dirname, '../static')));

// Add this error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
