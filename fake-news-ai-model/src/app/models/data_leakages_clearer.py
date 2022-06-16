import pandas


def drop_text_prefix(text: str, prefix: str, max_prefix_length: int = 5) -> str:
    """ Drop the specified prefix from the specified text. """
    text_split: list[str] = str.split(text, ' ')

    if prefix not in text_split[:max_prefix_length]:
        return text

    return str.split(text, prefix)[-1]


class DataLeakagesClearer(object):
    """ Clears the data leakages from the kaggle dataset. """

    def __init__(self, data: pandas.DataFrame):
        self._data = data

    def call(self) -> pandas.DataFrame:
        """ Clear data leakages. """
        self._drop_news_sources_prefixes()
        self._drop_date_and_subject_columns()
        self._drop_duplicates()

        return self._data

    def _drop_news_sources_prefixes(self) -> None:
        """ Drop the prefixes containing a news sources (i.e. Reuters and 21st Century Wire) from the texts. """
        self._data.text = self._data.text.apply(lambda text: drop_text_prefix(text.replace(" -", ""), "(Reuters)")[1:])
        self._data.text = self._data.text.apply(lambda text: drop_text_prefix(text, "21st Century Wire"))

    def _drop_date_and_subject_columns(self) -> None:
        """ Drop the date and the subject columns from the dataset. """
        self._data = self._data.drop(["subject", "date"], axis=1)

    def _drop_duplicates(self) -> None:
        """ Drop duplicate news. """
        self._data = self._data.drop_duplicates()

