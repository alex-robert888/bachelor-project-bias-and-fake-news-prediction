from src.app.models.model import Model
from src.app.models.dataset import Dataset

if __name__ == "__main__":
    dataset = Dataset()
    dataset.load()

    model = Model(dataset)
    model.train()
