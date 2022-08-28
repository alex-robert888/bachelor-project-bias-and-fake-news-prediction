import os
import pickle
from sklearn.svm import SVC
import matplotlib.pyplot as plt
from src.heading_clickbait_classifier.dataset import Dataset
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_predict
from sklearn.metrics import accuracy_score, confusion_matrix
from sklearn.calibration import CalibratedClassifierCV, calibration_curve
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import f1_score, accuracy_score, precision_score, recall_score


class Model(object):
    """ The machine learning model for fake news detection """

    def __init__(self, dataset: Dataset, model_save_file_path: str, transformer_save_file_path: str, feature_extraction_algorithm_type: type):
        self._dataset = dataset
        self._model_save_file_path = model_save_file_path
        self._transformer_save_file_path = transformer_save_file_path
        self._lg_classifier = SVC(verbose=1)
        self._loaded_svm_classifier = None
        self._loaded_transformer = None

        # self._train_data, self._test_data = self._dataset.load()
        # self._feature_extraction_algorithm = feature_extraction_algorithm_type(self._train_data, self._test_data)
        # self._train_data, self._test_data = self._feature_extraction_algorithm.call()

    def train(self) -> None:
        """ Train and save the machine learning model """
        if os.path.exists(self._model_save_file_path):
            raise ValueError("Model save file path already exists.")

        if os.path.exists(self._transformer_save_file_path):
            raise ValueError("Transformer save file path already exists.")

        self._fit_model()
        self._save_model_to_file()
        self._save_transformer_to_file()
        self._test_model()

    def predict(self, content: str) -> []:
        self.load()
        transformed_content = self._loaded_transformer.transform([content])
        return self._loaded_svm_classifier.predict(transformed_content)[0]

    def predict_proba(self, content: str) -> []:
        self.load()
        transformed_content = self._loaded_transformer.transform([content])
        return self._loaded_svm_classifier.predict_proba(transformed_content)[0]

    def validate(self) -> None:
        self.load()
        x = self._loaded_transformer.transform(self._test_data.entries)
        y = self._test_data.labels
        predicted = cross_val_predict(self._loaded_svm_classifier, x, y, cv=2)
        print("confusion_matrix: ", confusion_matrix(y, predicted))
        print("accuracy: ", accuracy_score(y, predicted))
        print("precision: ", precision_score(y, predicted, pos_label="1"))
        print("recall: ", recall_score(y, predicted, pos_label="1"))
        print("f1_score: ", f1_score(y, predicted, pos_label="1"))

    def plot_predictited_probabilities(self) -> None:
        self.load()
        x = self._loaded_transformer.transform(self._test_data.entries)
        y = self._test_data.labels

        fig = plt.figure()
        ax = fig.add_subplot()
        ax.plot([0, 1], [0, 1], "b--", label="Perfectly calibrated")
        ax.set_ylabel("Fraction of positives")
        ax.set_xlabel("Mean predicted value")
        ax.set_title('Calibration plot (reliability curve)')

        prob_pos_rfc = self._loaded_svm_classifier.predict_proba(x)[:, 1]
        ax.plot(prob_pos_rfc)
        plt.show()

    def plot_calibration_curve(self) -> None:
        self.load()
        x = self._loaded_transformer.transform(self._test_data.entries)
        y = self._test_data.labels
        fig = plt.figure()
        ax = fig.add_subplot()
        ax.plot([0, 1], [0, 1], "b--", label="Perfectly calibrated")
        ax.set_ylabel("Fraction of positives")
        ax.set_xlabel("Mean predicted value")
        ax.set_title('Calibration plot (reliability curve)')

        prob_pos_rfc = self._loaded_svm_classifier.predict_proba(x)[:, 1]
        fraction_of_positives_rfc, mean_predicted_value_rfc = calibration_curve(y, prob_pos_rfc, n_bins=10, pos_label='1')
        ax.plot(mean_predicted_value_rfc, fraction_of_positives_rfc, "s-", label="%s" % ('Support Vector Machine'))
        plt.show()

    def load(self):
        """ Load the mode from the file """
        print("Load the model.")
        self._loaded_svm_classifier = pickle.load(open(self._model_save_file_path, 'rb'))
        self._loaded_transformer = pickle.load(open(self._transformer_save_file_path, 'rb'))

    def _fit_model(self) -> None:
        """ Train the model """
        print("Start training the SVM classifier.")
        self._lg_classifier.fit(self._train_data.entries, self._train_data.labels)
        print("Finished training the SVM classifier.")

    def _save_model_to_file(self) -> None:
        """ Save the model to a file """
        print("Save model to file.")
        os.makedirs(os.path.dirname(self._model_save_file_path), exist_ok=True)
        pickle.dump(self._lg_classifier, open(self._model_save_file_path, 'wb'))

    def _save_transformer_to_file(self):
        print("Save transformer to file.")
        os.makedirs(os.path.dirname(self._transformer_save_file_path), exist_ok=True)
        pickle.dump(self._feature_extraction_algorithm.tfidf_vectorizer, open(self._transformer_save_file_path, 'wb'))

    def _test_model(self) -> None:
        """ Test the performance of the model """
        print("Test model")
        score = self._lg_classifier.score(self._test_data.entries, self._test_data.labels)
        print(f"Test score: {score}")
