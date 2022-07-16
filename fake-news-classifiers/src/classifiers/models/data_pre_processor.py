import pandas
import nltk
import re


class DataPreProcessor(object):
    """ Performs some NLP specific pre-processing on the fake news contents to remove useless / noisy information. """

    def __init__(self, data: pandas.DataFrame):
        self._data = data

    def call(self) -> pandas.DataFrame:
        """ Perform a series of pre-processing on the text. """
        print("Pre-processing started.")
        self._lowercase()
        self._remove_hyperlinks()
        self._remove_anchor_tags()
        self._remove_html_tags()
        self._tokenize()
        self._remove_stop_words()
        self._remove_punctuation()
        self._lemmatize()
        print("Pre-processing completed.")

        return self._data

    def _lowercase(self) -> None:
        """ Lowercase the fake news contents. """
        print("Lowercase")
        self._data.text = self._data.text.apply(lambda text: text.lower())

    def _remove_hyperlinks(self) -> None:
        """ Remove hyperlink from text """
        print("Remove hyperlinks")
        self._data.text = self._data.text.apply(lambda text: re.sub(r"https?://\S+", "", text))

    def _remove_anchor_tags(self) -> None:
        """ Remove anchor tags but keep their content """
        print("Remove anchor tags.")
        self._data.text = self._data.text.apply(lambda text: re.sub(r"<a[^>]*>(.*?)</a>", r"\1", text))

    def _remove_html_tags(self) -> None:
        """ Remove html tags but keep their content """
        print("Remove html tags.")
        self._data.text = self._data.text.apply(lambda text: re.sub(r"<.*?>", " ", text))

    def _tokenize(self) -> None:
        """ Split text into words """
        print("Tokenize")
        self._data.text = self._data.text.apply(lambda text: nltk.tokenize.word_tokenize(text))

    def _remove_stop_words(self) -> None:
        """ Remove the stopwords from the fake news contents. """
        print("Remove stop words")
        stop_words = nltk.corpus.stopwords.words('english')
        self._data.text = self._data.text.apply(lambda text: [word for word in text if not word in stop_words])

    def _remove_punctuation(self) -> None:
        """ Remove the punctuation marks from the fake news contents. """
        print("Remove punctuation")
        tokenizer = nltk.RegexpTokenizer(r"\w+")
        self._data.text = self._data.text.apply(lambda text: tokenizer.tokenize(' '.join(text)))

    def _lemmatize(self) -> None:
        """ Lemmatize the words (convert them to their root form) of the fake news contents."""
        print("Lemmatize")
        lemmatizer = nltk.stem.WordNetLemmatizer()
        self._data.text = self._data.text.apply(lambda text: self._lemmatize_text(text, lemmatizer))

    def _lemmatize_text(self, text: list, lemmatizer: nltk.stem.WordNetLemmatizer) -> list[str]:
        """ Lemmatize a specified text using a specified lemmatizer """
        result = list()
        for token, tag in nltk.pos_tag(text):
            pos = tag[0].lower()

            if pos not in ['a', 'r', 'n', 'v']:
                pos = 'n'

            result.append(lemmatizer.lemmatize(token, pos))

        return result
