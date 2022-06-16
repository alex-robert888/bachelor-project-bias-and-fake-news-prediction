class LabeledData(object):
    """ Representation for a set of labeled data """

    def __init__(self, entries: list, labels: list):
        self._entries = entries
        self._labels = labels

    @property
    def entries(self):
        return self._entries

    @property
    def labels(self):
        return self._labels
