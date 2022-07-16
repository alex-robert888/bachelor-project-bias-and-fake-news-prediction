from src.classifiers.models.model import Model
from src.classifiers.models.dataset import Dataset
from src.classifiers.models.tf_idf_feature_extraction import TfIdfFeatureExtraction

if __name__ == "__main__":
    dataset = Dataset()
    model = Model(
        dataset,
        "../../saved-models/svm-tf-idf-model.sav",
        "../../saved-models/tf-idf-vectorizer.sav",
        TfIdfFeatureExtraction
    )
    x = model.plot_predictited_probabilities()
