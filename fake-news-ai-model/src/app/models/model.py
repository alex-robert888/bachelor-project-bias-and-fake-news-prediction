from ..models.dataset import Dataset


class Model(object):
    """ The machine learning model for fake news detection """

    def __init__(self, dataset: Dataset):
        self._dataset = dataset

    def train(self):
        """ Train the machine learning model """
        pass
