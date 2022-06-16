import pandas
from unittest import TestCase
from ..app.models.data_pre_processor import DataPreProcessor


class TestDataPreProcessor(TestCase):
    def setUp(self) -> None:
        self._data = pandas.DataFrame({
            "title": [
                "As U.S. budget fight looms, Republicans flip t...",
                "U.S. military to accept transgender recruits o...",
            ],
            "text": [
                "The better head of a conservative party is going to...",
                "Transgender people will be from now on allowed to...",
            ],
            "subject": [
                "politicsNews",
                "politicsNews",
            ],
            "date": [
                "December 31, 2017",
                "December 29, 2017",
            ],
        })

        data_pre_processor = DataPreProcessor(self._data)
        self._data = data_pre_processor.call()

    def test_call__valid_data__data_tokenized(self):
        self.assertIsInstance(self._data.text[0], list)

    def test_call__valid_data__data_lowercased(self):
        self.assertTrue(' '.join(self._data.text[0]).islower())

    def test_call__valid_data__data_without_stop_words(self):
        self.assertNotIn("the", self._data.text[0])
        self.assertNotIn("of", self._data.text[0])
        self.assertNotIn("a", self._data.text[0])
        self.assertNotIn("to", self._data.text[0])

    def test_call__valid_data__data_without_punctuation(self):
        self.assertNotIn('.', ' '.join(self._data.text[0]))

    def test_call__valid_data__data_lemmatized(self):
        self.assertEqual(self._data.text[0], ['well', 'head', 'conservative', 'party', 'go'])
