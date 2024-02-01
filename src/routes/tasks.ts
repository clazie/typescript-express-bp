// Add your CRUD API implementation here
import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Task } from '../models/task';

const router = Router();
let tasks: Task[] = [];

const taskValidationRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('completed').isBoolean().withMessage('Completed must be a boolean'),
];

// Create a new task /(eg. GET http://localhost:3000/tasks , body: {"title": "Test", "description": "Test", "completed": false} )
router.post('/', taskValidationRules, (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let max_id = 0;
  tasks.forEach(element =>{
    if (element.id > max_id){
      max_id = element.id;
    }
  });

  const task: Task = {
    id: max_id + 1,
    title: req.body.title,
    description: req.body.description,
    completed: false,
  };

  tasks.push(task);
  res.status(201).json(task)
});

// Update a task /(eg. PUT http://localhost:3000/tasks/1 , body: {"title": "Test", "description": "Test", "completed": true} )
router.put('/:id', taskValidationRules, (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const task = tasks.find((t) => t.id === parseInt(req.params.id));

  if (!task) {
    res.status(404).json({error:String("Task "+ req.params.id + " not found" )});
  } else {
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.completed = req.body.completed || task.completed;

    res.json(task);
  }

});

// Get a list of all tasks /(eg. GET http://localhost:3000/tasks )
router.get('/', (req: Request, res: Response) => {
  res.json(tasks);
});

// Get a task /(eg. GET http://localhost:3000/tasks/1 )
router.get('/:id', (req: Request, res: Response) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id));

  if (!task) {
    res.status(404).json({error:String("Task "+ req.params.id + " not found" )});
  } else {
    res.json(task);
  }
});

// Delete a task /(eg. DELETE http://localhost:3000/tasks/1 )
router.delete('/:id', (req: Request, res: Response) => {
  const index = tasks.findIndex((t) => t.id === parseInt(req.params.id));

  if (index === -1) {
    res.status(404).json({error:String("Task "+ req.params.id + " not found" )});
  } else {
    tasks.splice(index, 1);
    res.status(204).send();
  }
});

export default router;
