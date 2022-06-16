import pandas
from typing import Final
import sklearn.model_selection

from ..models.data_leakages_clearer import DataLeakagesClearer
from ..models.data_pre_processor import DataPreProcessor
from ..models.labeled_data import LabeledData


class Dataset(object):
    """ Load and process the dataset (prepare it to be fed to the models) """

    def __init__(self, fake_csv_file_path: str = 'dataset/Fake.csv', true_csv_file_path: str = 'dataset/True.csv'):
        self._fake_csv_file_path: Final = fake_csv_file_path
        self._true_csv_file_path: Final = true_csv_file_path
        self._data: pandas.DataFrame = pandas.DataFrame()

    def load(self) -> [LabeledData, LabeledData]:
        """ Load, process, pre-process the data. Split data into training and testing sets. """
        self._load_and_process_data()

        train_data, test_data = self._split_data_into_test_and_train_sets()
        return train_data, test_data

    def _load_and_process_data(self) -> None:
        """ Load data, clear data leakages and pre-process data for the ML model. """
        self._load_data()

        data_leakages_cleaner = DataLeakagesClearer(self._data)
        self._data = data_leakages_cleaner.call()

        data_pre_processor = DataPreProcessor(self._data)
        self._data = data_pre_processor.call()

    def _load_data(self) -> None:
        """ Read and merge the true and fake datasets. """
        true_data = pandas.read_csv(self._true_csv_file_path)
        fake_data = pandas.read_csv(self._fake_csv_file_path)

        true_data['fake'] = 0
        fake_data['fake'] = 1

        self._data = pandas.concat([true_data, fake_data])

    def _split_data_into_test_and_train_sets(self) -> [LabeledData, LabeledData]:
        """ Split the data into training and testing sets, using 5-fold validation. """
        labels = self._data.fake
        train_entries, test_entries, train_labels, test_labels \
            = sklearn.model_selection.train_test_split(self._data, labels, test_size=0.2)

        train_data = LabeledData(train_entries, train_labels)
        test_data = LabeledData(test_entries, test_labels)

        return train_data, test_data
