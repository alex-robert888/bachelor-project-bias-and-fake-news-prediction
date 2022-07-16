from unittest import TestCase
from ..app.models.data_leakages_clearer import drop_text_prefix, DataLeakagesClearer
import pandas


class Test(TestCase):
    def test_drop_text_prefix__validD_data__should_drop_prefix(self):
        text = "WASHINGTON (Reuters) - The head of a conservatives..."
        prefix = "(Reuters)"

        result = drop_text_prefix(text, prefix)
        self.assertEqual(result, " - The head of a conservatives...")

    def test_drop_text_prefix__prefix_not_meeting_max_length__should_not_drop_prefix(self):
        text = "WASHINGTON - The head of a conservatives... (Reuters)"
        prefix = "(Reuters)"

        result = drop_text_prefix(text, prefix, 2)
        self.assertEqual(result, text)


class TestDataLeakagesClearer(TestCase):
    def setUp(self) -> None:
        self._data = pandas.DataFrame({
            "title": [
                "As U.S. budget fight looms, Republicans flip t...",
                "U.S. military to accept transgender recruits o...",
                "U.S. military to accept transgender recruits o...",
            ],
            "text": [
                "WASHINGTON (Reuters) - The head of a conservat...",
                "WASHINGTON (Reuters) - Transgender people will...",
                "WASHINGTON (Reuters) - Transgender people will..."
            ],
            "subject": [
                "politicsNews",
                "politicsNews",
                "politicsNews"
            ],
            "date": [
                "December 31, 2017",
                "December 29, 2017",
                "December 29, 2017"
            ],
        })
        self._data_leakages_clearer = DataLeakagesClearer(self._data)
        self._data = self._data_leakages_clearer.call()

    def test_call__valid_data__should_drop_reuters_prefixes_alongside_dashes(self):
        text_with_reuters_dropped = "The head of a conservat..."
        self.assertEqual(self._data["text"][0], text_with_reuters_dropped)

    def test_call__valid_data__should_drop_subject_and_date_columns(self):
        self.assertNotIn("date", self._data.columns)
        self.assertNotIn("subject", self._data.columns)

    def test_call__valid_data__should_drop_duplicates(self):
        count_rows = self._data.shape[0]
        self.assertEqual(count_rows, 2)

