import express from 'express';
import Feedback from '../database/feedback';


const router = express.Router()

/* Get source by url */
router.post('/', async (req, res, next) => {
  try {
    await Feedback.create(req.body);
    res.status(201).send("Feedback created.");
  } catch (e) {
    next(e);
  }
});

export default router