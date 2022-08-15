from sklearn.feature_extraction.text import TfidfVectorizer
from src.heading_clickbait_classifier.labeled_data import LabeledData


class TfIdfFeatureExtraction(object):
    """ Extract TF-IDF features from given train and test datasets """

    def __init__(self, train_data: LabeledData, test_data: LabeledData):
        self._train_data = train_data
        self._test_data = test_data
        self.tfidf_vectorizer = TfidfVectorizer()

    def call(self):
        print("Extract TF-IDF features.")
        self._train_data.entries = self.tfidf_vectorizer.fit_transform(self._train_data.entries)
        self._test_data.entries = self.tfidf_vectorizer.transform(self._test_data.entries)

        return self._train_data, self._test_data
