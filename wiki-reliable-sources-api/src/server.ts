import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import winston from 'winston';
import sourcesRouter from './sources-router';
import mongoose from 'mongoose';


const app = express();
app.use(cors());

mongoose.connect('mongodb+srv://skoda888:1234@cluster0.dvtoo5l.mongodb.net/WikipediaReliableSources?retryWrites=true&w=majority')
        .then(() => console.log("Successfully connected to the database."))
        .catch((e) => console.log("Failed connecting to the database: ", e));

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

logger.add(new winston.transports.Console({
  format: winston.format.simple(),
}));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
})

app.use('/sources', sourcesRouter);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});