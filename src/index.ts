import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
// import gameRouter from './routes/game.routes';
const app: Application = express();
const PORT = 6759;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
  });
  
  app.get('/', (req, res) => {
    res.json({ message: 'API ready to receive requests! 🚀' });
  });
  
  // app.use('/api/game', gameRouter);
  



try {
    app.listen(PORT, async (): Promise<void> => {
        console.log(`Connected successfully on port ${PORT} available at http://localhost:${PORT}`);
    });
} catch (error: any) {
    console.error(`Error occurred: ${error.message}`);
}