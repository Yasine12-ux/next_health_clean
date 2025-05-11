import joblib
import pickle
import numpy as np

import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem.snowball import SnowballStemmer
# load data
import numpy as np
import pandas as pd

# Download NLTK resources (if not already downloaded)
nltk.download('punkt')
nltk.download('stopwords')

# Initialize NLTK's SnowballStemmer and stopwords for French
stemmer = SnowballStemmer('french')
stop_words = set(stopwords.words('french'))

class KNNModel:
    TOKENS_MAX_LENGTH =300
    
    DICT_PATH = "tokenizer_dict.pkl"
    MODEL_PATH = 'knn_product_model.joblib'
    NUM_PREPROCSS_PATH = "numeric_transformer.joblib"
    CAT_PREPROCSS_PATH = "categorical_transformer.joblib"

    BASE_PATH = "modeldata/"

    numeric_features = ['taille_cm', 'poids_kg', 'imc', 'nb_grossesse', 'nb_enfants_vivants',
                                'nb_macrosomies', 'nb_avortements', 'nb_mort_nes', 'age_menopause',
                                'alcool_semaine', 'nb_cigarette_par_jour', 'age']
    categorical_features = ['groupe_sanguin', 'hta', 'diabete', 'dyslipidemie', 'tabac_status',
                                    'drogue']

    def __init__(self):
        # self.model = None 
        # self.numeric_transformer = None
        # self.categorical_transformer = None
        # self.dictionary={}
        self.load_model()
        
    def load_model(self):
        with open(self.BASE_PATH+self.DICT_PATH, 'rb') as f:
            self.dictionary=pickle.load(f)
        self.model=joblib.load(self.BASE_PATH+"knn_model.joblib")
        self.numeric_transformer=joblib.load(self.BASE_PATH+self.NUM_PREPROCSS_PATH)
        self.categorical_transformer=joblib.load(self.BASE_PATH+self.CAT_PREPROCSS_PATH)
        
    def tokenizeText(self,text):
        # Convert text to lowercase
        text = text.lower()
        
        # Tokenize text using NLTK tokenizer
        tokens = word_tokenize(text)
        
        # Remove stopwords
        tokens = [token for token in tokens if token not in stop_words]
        
        # Apply stemming using SnowballStemmer
        stemmed_tokens = [stemmer.stem(token) for token in tokens]
        
        # Numerize tokens
        numerical_tokens = []
        for token in stemmed_tokens:
            if token not in self.dictionary:
                # dictionary[token] = torch.tensor(len(dictionary) + 1,dtype=torch.int32)
                self.dictionary[token] = len(self.dictionary) + 1
            numerical_tokens.append(self.dictionary[token])
        
        # Convert numerical tokens and dictionary values to tensors
        # numerical_tokens_tensor = torch.tensor(numerical_tokens)
        numerical_tokens_np = np.array(numerical_tokens)
        # return numerical_tokens_tensor
        return numerical_tokens_np
    
    def pad_sequences(self,sequence_list, maxlen=None):
        if not maxlen:
            maxlen = max(len(seq) for seq in sequence_list)
        padded_sequences = np.zeros((len(sequence_list), maxlen), dtype=int)
        for i, seq in enumerate(sequence_list):
            if len(seq) > 0:  # Check if the sequence is not empty
                padded_sequences[i, :len(seq)] = seq
        return padded_sequences


    def preprocessData(self,inputData)->np.ndarray:
        descriptionsTokenized = inputData['diagnostic'].apply(lambda x: self.tokenizeText(x))
        descriptionsTokenizedPadded=self.pad_sequences(descriptionsTokenized,self.TOKENS_MAX_LENGTH)
        
        numeric_transformed = self.numeric_transformer.transform(inputData[self.numeric_features].to_numpy())

        categorical_transformed  = self.categorical_transformer.transform(inputData[self.categorical_features].to_numpy())

        preprocessed_data = np.hstack((numeric_transformed, categorical_transformed.toarray()))
        
        X_combined = np.hstack((preprocessed_data, descriptionsTokenizedPadded))
        return X_combined
        
    def predict(self,inputData):

        preproccedData=None
        try:
            preproccedData = self.preprocessData(inputData)
        except :
            return None
        
        # just unique
        return self.model.predict(preproccedData)
        

    def predictMany(self,inputData,k=10):
        preproccedData=None
        try:
            preproccedData = self.preprocessData(inputData)
        except :
            return None
        _, indices = self.model.kneighbors(preproccedData, n_neighbors=k)
        return indices


