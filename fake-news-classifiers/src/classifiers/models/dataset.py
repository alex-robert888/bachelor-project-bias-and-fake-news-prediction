import pandas
import os.path
import sklearn.model_selection
from typing import Final
from pathlib import Path
from ..models.data_leakages_clearer import DataLeakagesClearer
from ..models.data_pre_processor import DataPreProcessor
from ..models.labeled_data import LabeledData


class Dataset(object):
    """ Load and process the dataset (prepare it to be fed to the models) """

    def __init__(self, fake_csv_file_path: str = '../../dataset/Fake.csv', true_csv_file_path: str = '../../dataset/True.csv'):
        self._fake_csv_file_path: Final = fake_csv_file_path
        self._true_csv_file_path: Final = true_csv_file_path
        self._processed_csv_file_path: Final = "../../dataset/processed/Data.csv"
        self._data: pandas.DataFrame = pandas.DataFrame()

    def load(self) -> [LabeledData, LabeledData]:
        """ Load, process, pre-process the data or load the already previously processed data.
            Split data into training and testing sets.
        """
        if self._exists_file_with_processed_data():
            self._load_processed_data()
        else:
            self._load_process_and_save_data()

        train_data, test_data = self._split_data_into_test_and_train_sets()
        return train_data, test_data

    def _exists_file_with_processed_data(self):
        """ Check if is there already a file with processed data in the project """
        return os.path.exists(self._processed_csv_file_path)

    def _load_processed_data(self) -> None:
        """ Load file with already processed data """
        print("Load dataset.")
        self._data = pandas.read_csv(self._processed_csv_file_path)
        print("Data loaded")
        print(self._data.head())

    def _load_process_and_save_data(self) -> None:
        """ Load data, clear data leakages and pre-process data for the ML model. """
        self._load_unprocessed_data()
        self._process_data()
        self._save_processed_data()

    def _load_unprocessed_data(self) -> None:
        """ Read and merge the true and fake unprocessed datasets. """
        true_data = pandas.read_csv(self._true_csv_file_path)
        fake_data = pandas.read_csv(self._fake_csv_file_path)

        true_data['fake'] = 0
        fake_data['fake'] = 1

        self._data = pandas.concat([true_data, fake_data])

    def _process_data(self) -> None:
        """ Clear data leakages and do the pre-processing """
        data_leakages_cleaner = DataLeakagesClearer(self._data)
        self._data = data_leakages_cleaner.call()

        data_pre_processor = DataPreProcessor(self._data)
        self._data = data_pre_processor.call()

        self._join_tokens_into_strings()

    def _join_tokens_into_strings(self):
        """ Join each set of tokens back into strings """
        print("Join tokens.")
        self._data.text = self._data.text.apply(lambda text: " ".join([word for word in text]))

    def _save_processed_data(self) -> None:
        """ Save processed data into a CSV file. """
        filepath = Path(self._processed_csv_file_path)
        filepath.parent.mkdir(parents=True, exist_ok=True)
        self._data.to_csv(filepath)

    def _split_data_into_test_and_train_sets(self) -> [LabeledData, LabeledData]:
        """ Split the data into training and testing sets, using 5-fold validation. """
        print("Split data into training and test sets.")
        entries = self._data.text.values.astype('U')
        labels = self._data.fake.values.astype('U')
        train_entries, test_entries, train_labels, test_labels \
            = sklearn.model_selection.train_test_split(entries, labels, test_size=0.2)

        train_data = LabeledData(train_entries, train_labels)
        test_data = LabeledData(test_entries, test_labels)

        return train_data, test_data
