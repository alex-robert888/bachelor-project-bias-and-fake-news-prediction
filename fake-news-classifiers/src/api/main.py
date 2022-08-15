import math
from flask import Flask
from flask import request
from flask_cors import CORS
from pandas import DataFrame
from src.classifiers.models.model import Model
from src.classifiers.models.dataset import Dataset
from src.classifiers.models.data_leakages_clearer import DataLeakagesClearer
from src.classifiers.models.data_pre_processor import DataPreProcessor
from src.classifiers.models.tf_idf_feature_extraction import TfIdfFeatureExtraction
from newspaper import Article

app = Flask(__name__)
CORS(app)


@app.route("/svm")
def svm():
    content = request.args.get('content')
    data_frame = DataFrame({"text": [content], "subject": [""], "date": [""]})

    data_leakages_cleaner = DataLeakagesClearer(data_frame)
    data_frame = data_leakages_cleaner.call()

    data_pre_processor = DataPreProcessor(data_frame)
    data_frame = data_pre_processor.call()

    data_frame.text = data_frame.text.apply(lambda text: " ".join([word for word in text]))

    dataset = Dataset()
    model = Model(
        dataset,
        "./../../saved-models/svm-tf-idf-model.sav",
        "./../../saved-models/tf-idf-vectorizer.sav",
        TfIdfFeatureExtraction
    )
    model.predict_proba(data_frame.text[0])
    score = 100 * model.predict_proba(data_frame.text[0])[0]
    score = math.ceil(score) if score < 50 else math.floor(score)

    return {"bias_score": score}

@app.route("/headlines-lr")
def headlines_lr():
    headline = request.args.get('headline')
    data_frame = DataFrame({"text": [headline]})

    data_pre_processor = DataPreProcessor(data_frame)
    data_frame = data_pre_processor.call()

    data_frame.text = data_frame.text.apply(lambda text: " ".join([word for word in text]))

    dataset = Dataset()
    model = Model(
        dataset,
        "./../../saved-models/heading-clickbait/heading-log-reg-tf-idf-model.sav",
        "./../../saved-models/heading-clickbait/heading-log-reg-tf-idf-vectorizer.sav",
        TfIdfFeatureExtraction
    )
    model.predict_proba(data_frame.text[0])
    score = 100 * model.predict_proba(data_frame.text[0])[0]
    score = math.ceil(score) if score < 50 else math.floor(score)

    return {"clickbait": score}

@app.route("/scrape-article")
def scrape_article():
    url = request.args.get('url')

    article = Article(url)
    article.download()
    article.parse()

    return {
        "title": article.title,
        "authors": article.authors,
        "text": article.text
    }


if __name__ == "__main__":
    app.run(debug=True)