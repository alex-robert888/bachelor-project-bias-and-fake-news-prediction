import axios from 'axios';

const WIKI_URL = 'https://en.wikipedia.org/wiki/Wikipedia:Reliable_sources/Perennial_sources'

export const scrape = async () => {
  const response = await axios.get(WIKI_URL);
  const html = response.data;
  console.log(html);
}