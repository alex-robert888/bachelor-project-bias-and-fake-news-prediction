from src.classifiers.models.model import Model
from src.classifiers.models.dataset import Dataset
from src.classifiers.models.tf_idf_feature_extraction import TfIdfFeatureExtraction

if __name__ == "__main__":
    dataset = Dataset()
    model = Model(
        dataset,
        "../../saved-models/2-knn-tf-idf-model.sav",
        "../../saved-models/2-knn-tf-idf-vectorizer.sav",
        TfIdfFeatureExtraction
    )
    model.train()
    model.validate()
