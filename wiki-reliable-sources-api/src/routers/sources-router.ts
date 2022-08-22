import express from 'express';
import { scrape } from '../sources-services';
import Source from '../database/source';


const router = express.Router()

/* Get source by url */
router.get('/', async (req, res) => {
  // Get url from query parameters.
  const url = req.query["url"]
  if (url === undefined) {
    res.status(400).json({message: "Required query parameter 'url' is missing."})
  }

  // Extract the url domain
  const urlObject = new URL(url as string);
  const urlDomain = urlObject.hostname.replace('www.','')

  // Find source by url
  const source = await Source.findOne({url: {$regex: urlDomain, $options: 'i' }})

  // respond with: * 404 & message, if no source with specified url was found
  //               * the source found, otherwise
  if (source === null) {
    res.status(404).json({message: "Source with specified url does not exist."})
  }
  res.json({name: source?.name, url: source?.url, summary: source?.summary, status: source?.status})
});

/* Scrape wiki page (Reliable sources/Perennial sources) and save to db */
router.post('/scrape', async (req, res) => {
  await scrape()
});

export default router