import express from 'express';
import cheerio from 'cheerio';
import { scrape } from './sources-services';

const router = express.Router()

// Get the list of sources
router.get('/', (req, res) => {
  res.send("It goddamn workReliable sources/Perennial sources!");
});

// Scrape wiki page (Reliable sources/Perennial sources) and save to db
router.post('/scrape', async (req, res) => {
  await scrape();
});

export default router;