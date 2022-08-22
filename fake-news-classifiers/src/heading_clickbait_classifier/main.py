from src.heading_clickbait_classifier.model import Model
from src.heading_clickbait_classifier.dataset import Dataset
from src.heading_clickbait_classifier.tf_idf_feature_extraction import TfIdfFeatureExtraction

if __name__ == '__main__':
    dataset = Dataset()
    model = Model(
        dataset,
        "../../saved-models/heading-clickbait/test-heading-lr-tf-idf-model.sav",
        "../../saved-models/heading-clickbait/test-heading-lr-tf-idf-vectorizer.sav",
        TfIdfFeatureExtraction
    )
    x = model.train()