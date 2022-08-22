import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import winston from 'winston';
import expressWinston from 'express-winston';
import sourcesRouter from './routers/sources-router';
import feedbacksRouter from './routers/feedbacks-router';
import mongoose from 'mongoose';


const app = express();
app.use(cors());
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: false,
  msg: "HTTP  ",
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) { return false; }
}));
app.use(express.json());

mongoose.connect('mongodb+srv://skoda888:1234@cluster0.dvtoo5l.mongodb.net/WikipediaReliableSources?retryWrites=true&w=majority')
        .then(() => console.log("Successfully connected to the database."))
        .catch((e) => console.log("Failed connecting to the database: ", e));


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
})

app.use('/sources', sourcesRouter);
app.use('/feedbacks', feedbacksRouter);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});