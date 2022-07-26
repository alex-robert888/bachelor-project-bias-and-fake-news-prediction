import axios from 'axios';
import { CheerioAPI, Element, load } from 'cheerio';
import Source from './database/source';

const WIKI_URL = 'https://en.wikipedia.org/wiki/Wikipedia:Reliable_sources/Perennial_sources'

type TSourceStatus = "generally reliable" | "no consensus" | "generally unreliable" | "deprecated" | "blacklisted";

type TSource = {
  name: string,
  wikiPageUrl?: string,
  url: string,
  status: Array<TSourceStatus>,
  summary: string
}


export const scrape = async () => {
  // Delete the Sources table. 
  // Better to keep this commented for most of the times
  // await Source.deleteMany({});

  // Load the html of the wiki page.
  const response = await axios.get(WIKI_URL);
  const html = response.data;
  const $ = load(html);

  // Iterate over and process each row from the news sources table
  let sources: Array<TSource> = []
  $('.perennial-sources tr', html).each((i, elem) => {
    if (i >= 2) sources.push(processWebsite($, elem));
  });

  // Get the urls of the websites accessing their wiki page
  await Promise.all(
    sources
      .filter(w => w.wikiPageUrl !== "q")
      .map(async (w) => w.url = await getWebsiteUrlFromWikiPage(w.wikiPageUrl!))
  );
  
  // Save the list of sources
  sources = sources.map(({wikiPageUrl, ...keepAttributes}) => keepAttributes)  
  Source.create(sources);
}

const processWebsite = ($: CheerioAPI, parentElem: Element) => {
  let websiteAttributes: TSource = {
    name: "", wikiPageUrl: "", url: "", status: [], summary: ""
  };

  $("td", parentElem).each((i, tdElem) => {
    if (i == 0) {
      websiteAttributes.name = $("a", tdElem).text();
      websiteAttributes.wikiPageUrl = "https://en.wikipedia.org" + $("a", tdElem).attr("href")
    } else if (i == 1) {
      $("a", tdElem).each((j, aElem) => {
        const status = $(aElem).attr("title")?.toLowerCase() as TSourceStatus;
        if (status) websiteAttributes.status.push(status);
      })
    }
    else if (i == 4) {
      websiteAttributes.summary = $(tdElem).html()!.toString();
    }
  });

  return websiteAttributes;
}

const getWebsiteUrlFromWikiPage = async (websiteWikiPageUrl: string): Promise<string> => {
  try {
    const response = await axios.get(websiteWikiPageUrl);
    const html = response.data;
    const $ = load(html);
      
    let url = "";
    $(".infobox-label", html).each((_, elem) => {
      if ($(elem).text().toLowerCase() === "url" || $(elem).text().toLowerCase() === "website") {
        url = $(elem).next(".infobox-data").find('a').attr("href")!
      }
    });

    console.log(url);
    return url;
  } catch(e) {
    return "";
  }
}