import pandas
import nltk


class DataPreProcessor(object):
    """ Performs some NLP specific pre-processing on the fake news contents to remove useless / noisy information. """

    def __init__(self, data: pandas.DataFrame):
        self._data = data

    def call(self) -> pandas.DataFrame:
        """ Perform a series of pre-processing on the text. """
        self._lowercase()
        self._tokenize()
        self._remove_stop_words()
        self._remove_punctuation()
        self._lemmatize()

        return self._data

    def _lowercase(self) -> None:
        """ Lowercase the fake news contents. """
        self._data.text = self._data.text.apply(lambda text: text.lower())

    def _tokenize(self) -> None:
        """ Split text into words """
        self._data.text = self._data.text.apply(lambda text: nltk.tokenize.word_tokenize(text))

    def _remove_stop_words(self) -> None:
        """ Remove the stopwords from the fake news contents. """
        stop_words = nltk.corpus.stopwords.words('english')
        self._data.text = self._data.text.apply(lambda text: [word for word in text if not word in stop_words])

    def _remove_punctuation(self) -> None:
        """ Remove the punctuation marks from the fake news contents. """
        tokenizer = nltk.RegexpTokenizer(r"\w+")
        self._data.text = self._data.text.apply(lambda text: tokenizer.tokenize(' '.join(text)))

    def _lemmatize(self) -> None:
        """ Lemmatize the words (convert them to their root form) of the fake news contents."""
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
