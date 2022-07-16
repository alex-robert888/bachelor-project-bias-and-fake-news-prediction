from unittest import TestCase, mock
from ..app.models.dataset import Dataset
import pandas


def read_csv_patcher_side_effect(file_path: str) -> pandas.DataFrame:
    if file_path == "dataset/Fake.csv":
        return pandas.DataFrame({
            "title": [
                "Donald Trump Sends Out Embarrassing...",
                "Drunk Bragging Trump Staffer Start...",
            ],
            "text": [
                "Donald Trump just couldn't wish all the best...",
                "House Intelligence Committee chairman...",
            ],
            "subject": [
                "News",
                "News",
            ],
            "date": [
                "December 31, 2017",
                "December 31, 2017",
            ],
        })

    if file_path == "dataset/True.csv":
        return pandas.DataFrame({
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

    raise ValueError("Invalid file path.")


class TestDataset(TestCase):
    def setUp(self) -> None:
        self._read_csv_patcher = mock.patch("srcs.classifiers.models.dataset.pandas.read_csv", side_effect=read_csv_patcher_side_effect)
        self._read_csv_patcher.start()

        dataset = Dataset()
        self._train_data, self._test_data = dataset.load()

    def tearDown(self) -> None:
        self._read_csv_patcher.stop()

    def test_load__valid_data__data_split_into_test_and_train_sets(self):
        self.assertEqual(len(self._train_data.entries) + len(self._test_data.entries), 4)
