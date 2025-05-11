import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import string
import nltk
import joblib  # For saving and loading models
from sklearn.exceptions import NotFittedError

# Download NLTK data
nltk.download('punkt')
nltk.download('stopwords')

class DiagnosticModel:
    
    MODEL_FEATURES = ["tailleCm", "poidsKg", "groupeSanguin", "IMC", "age", "sexe", "cin", "HTA", "diabete", 
                    "dyslipidemie", "autresAntecedentsFamiliaux", "nbGrossesse", "nbEnfantsVivants", 
                    "nbMacrosomies", "nbAvortements", "nbMortNes", "contraceptionUtilisee", "ageMenopause", 
                    "autresAntecedentsGynecoObstetriques", "alcoolSemaine", "tabacStatus", "nbCigaretteParJour", 
                    "drogue", "autreHabitudeToxique", "diagnostic", "prescription"]
    
    def __init__(self):
        self.vectorizerAF = TfidfVectorizer()
        self.vectorizerAG = TfidfVectorizer()
        self.vectorizerHT = TfidfVectorizer()
        self.vectorizerDiagnostic = TfidfVectorizer()
        
        self.knn = NearestNeighbors(metric=self.weighted_euclidean_distance)

        # Define numeric and categorical features
        self.numeric_features = ['tailleCm', 'poidsKg', 'IMC', 'nbGrossesse', 'nbEnfantsVivants',
                                'nbMacrosomies', 'nbAvortements', 'nbMortNes', 'ageMenopause',
                                'alcoolSemaine', 'nbCigaretteParJour', 'age']
        self.categorical_features = ['groupeSanguin', 'HTA', 'diabete', 'dyslipidemie', 'tabacStatus', 'drogue']
        
        # Define weights for features
        self.feature_weights = {
            'tailleCm': 1.0, 'poidsKg': 1.0, 'IMC': 1.0, 'nbGrossesse': 1.0, 'nbEnfantsVivants': 1.0,
            'nbMacrosomies': 1.0, 'nbAvortements': 1.0, 'nbMortNes': 1.0, 'ageMenopause': 1.0,
            'alcoolSemaine': 1.0, 'nbCigaretteParJour': 1.0, 'age': 1.0,
            'groupeSanguin': 1.0, 'HTA': 1.0, 'diabete': 1.0, 'dyslipidemie': 1.0,
            'tabacStatus': 1.0, 'drogue': 1.0,
            'autresAntecedentsFamiliaux': 1.0, 'autresAntecedentsGynecoObstetriques': 1.0, 
            'autreHabitudeToxique': 1.0, 'diagnostic': 4.0
        }

        # Preprocessing pipelines for numeric and categorical data
        self.numeric_transformer = Pipeline(steps=[
            ('imputer', SimpleImputer(strategy='mean')),
            ('scaler', StandardScaler())])

        self.categorical_transformer = Pipeline(steps=[
            ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
            ('onehot', OneHotEncoder(handle_unknown='ignore'))])

        # Combine preprocessing steps
        self.preprocessor = ColumnTransformer(
            transformers=[
                ('num', self.numeric_transformer, self.numeric_features),
                ('cat', self.categorical_transformer, self.categorical_features)])
        
        self.is_trained = False  # Flag to check if model has been trained
        self.data = pd.DataFrame()  # Store all data for retraining

    def clean_text(self, text):
        text = text.lower()
        text = text.translate(str.maketrans('', '', string.punctuation))
        tokens = word_tokenize(text)
        tokens = [word for word in tokens if word not in stopwords.words('english')]
        return ' '.join(tokens)

    def preprocess_data(self, data):
        data = data.copy()

        # Replace np.nan with empty string in text columns
        text_columns = ['autresAntecedentsFamiliaux', 'autresAntecedentsGynecoObstetriques', 'autreHabitudeToxique', 'diagnostic']
        for col in text_columns:
            data[col] = data[col].fillna('')

        data['clean_autresAntecedentsFamiliaux'] = data['autresAntecedentsFamiliaux'].apply(self.clean_text)
        data['clean_autresAntecedentsGynecoObstetriques'] = data['autresAntecedentsGynecoObstetriques'].apply(self.clean_text)
        data['clean_autreHabitudeToxique'] = data['autreHabitudeToxique'].apply(self.clean_text)
        data['clean_diagnostic'] = data['diagnostic'].apply(self.clean_text)
        
        # Ensure vectorizers are fitted before transforming
        if not hasattr(self.vectorizerAF, 'vocabulary_'):
            self.vectorizerAF.fit(data['clean_autresAntecedentsFamiliaux'])
        if not hasattr(self.vectorizerAG, 'vocabulary_'):
            self.vectorizerAG.fit(data['clean_autresAntecedentsGynecoObstetriques'])
        if not hasattr(self.vectorizerHT, 'vocabulary_'):
            self.vectorizerHT.fit(data['clean_autreHabitudeToxique'])
        if not hasattr(self.vectorizerDiagnostic, 'vocabulary_'):
            self.vectorizerDiagnostic.fit(data['clean_diagnostic'])
        
        X_AF = self.vectorizerAF.transform(data['clean_autresAntecedentsFamiliaux']).toarray()
        X_AG = self.vectorizerAG.transform(data['clean_autresAntecedentsGynecoObstetriques']).toarray()
        X_HT = self.vectorizerHT.transform(data['clean_autreHabitudeToxique']).toarray()
        X_Diag = self.vectorizerDiagnostic.transform(data['clean_diagnostic']).toarray()
        
        try:
            X_preprocessed = self.preprocessor.transform(data[self.numeric_features + self.categorical_features])
        except NotFittedError:
            self.preprocessor.fit(data[self.numeric_features + self.categorical_features])
            X_preprocessed = self.preprocessor.transform(data[self.numeric_features + self.categorical_features])

        # Concatenate all features
        X_combined = np.hstack((X_preprocessed, X_AF, X_AG, X_HT, X_Diag))
        
        return X_combined

    def weighted_euclidean_distance(self, x, y):
        # Define the combined feature weights
        combined_feature_weights = np.array([
            self.feature_weights['tailleCm'], self.feature_weights['poidsKg'], self.feature_weights['IMC'],
            self.feature_weights['nbGrossesse'], self.feature_weights['nbEnfantsVivants'],
            self.feature_weights['nbMacrosomies'], self.feature_weights['nbAvortements'],
            self.feature_weights['nbMortNes'], self.feature_weights['ageMenopause'],
            self.feature_weights['alcoolSemaine'], self.feature_weights['nbCigaretteParJour'], self.feature_weights['age'],
            *([self.feature_weights['groupeSanguin']] * len(self.preprocessor.transformers_[1][1]['onehot'].categories_[0])),
            *([self.feature_weights['HTA']] * len(self.preprocessor.transformers_[1][1]['onehot'].categories_[1])),
            *([self.feature_weights['diabete']] * len(self.preprocessor.transformers_[1][1]['onehot'].categories_[2])),
            *([self.feature_weights['dyslipidemie']] * len(self.preprocessor.transformers_[1][1]['onehot'].categories_[3])),
            *([self.feature_weights['tabacStatus']] * len(self.preprocessor.transformers_[1][1]['onehot'].categories_[4])),
            *([self.feature_weights['drogue']] * len(self.preprocessor.transformers_[1][1]['onehot'].categories_[5])),
            *([self.feature_weights['autresAntecedentsFamiliaux']] * self.vectorizerAF.transform(['']).shape[1]),
            *([self.feature_weights['autresAntecedentsGynecoObstetriques']] * self.vectorizerAG.transform(['']).shape[1]),
            *([self.feature_weights['autreHabitudeToxique']] * self.vectorizerHT.transform(['']).shape[1]),
            *([self.feature_weights['diagnostic']] * self.vectorizerDiagnostic.transform(['']).shape[1])
        ])
        return np.sqrt(np.sum(combined_feature_weights * (x - y) ** 2))

    def fit_initial(self, initial_data):
        self.data = initial_data.copy()

        # Preprocess data to handle missing values and clean text
        self.data['clean_autresAntecedentsFamiliaux'] = self.data['autresAntecedentsFamiliaux'].apply(self.clean_text)
        self.data['clean_autresAntecedentsGynecoObstetriques'] = self.data['autresAntecedentsGynecoObstetriques'].apply(self.clean_text)
        self.data['clean_autreHabitudeToxique'] = self.data['autreHabitudeToxique'].apply(self.clean_text)
        self.data['clean_diagnostic'] = self.data['diagnostic'].apply(self.clean_text)
        
        # Fit TF-IDF vectorizers with initial data
        self.vectorizerAF.fit(self.data['clean_autresAntecedentsFamiliaux'])
        self.vectorizerAG.fit(self.data['clean_autresAntecedentsGynecoObstetriques'])
        self.vectorizerHT.fit(self.data['clean_autreHabitudeToxique'])
        self.vectorizerDiagnostic.fit(self.data['clean_diagnostic'])
        
        X = self.preprocess_data(self.data)
        
        # Adjust n_neighbors to not exceed the number of samples
        n_neighbors = min(5, len(X))
        self.knn.set_params(n_neighbors=n_neighbors)
        
        self.knn.fit(X)
        self.is_trained = True

    def fit_retrain(self, new_data):
        # Concatenate new data to the existing data, including the prescription column
        self.data = pd.concat([self.data, new_data], ignore_index=True)
        
        # Preprocess data to handle missing values and clean text
        self.data['clean_autresAntecedentsFamiliaux'] = self.data['autresAntecedentsFamiliaux'].apply(self.clean_text)
        self.data['clean_autresAntecedentsGynecoObstetriques'] = self.data['autresAntecedentsGynecoObstetriques'].apply(self.clean_text)
        self.data['clean_autreHabitudeToxique'] = self.data['autreHabitudeToxique'].apply(self.clean_text)
        self.data['clean_diagnostic'] = self.data['diagnostic'].apply(self.clean_text)
        
        # Fit TF-IDF vectorizers with all data
        self.vectorizerAF.fit(self.data['clean_autresAntecedentsFamiliaux'])
        self.vectorizerAG.fit(self.data['clean_autresAntecedentsGynecoObstetriques'])
        self.vectorizerHT.fit(self.data['clean_autreHabitudeToxique'])
        self.vectorizerDiagnostic.fit(self.data['clean_diagnostic'])
        
        X = self.preprocess_data(self.data)
        
        # Adjust n_neighbors to not exceed the number of samples
        n_neighbors = min(5, len(X))
        self.knn.set_params(n_neighbors=n_neighbors)
        
        self.knn.fit(X)

    def predict(self, new_data):
        X_new = self.preprocess_data(new_data)
        distances, indices = self.knn.kneighbors(X_new)
        return distances, indices

    def predict_prescription(self, new_data):
        distances, indices = self.predict(new_data)
        prescriptions = self.data.iloc[indices.flatten()]['prescription']
        return prescriptions
    
    def save_model(self, file_path):
        # Save the model using joblib
        joblib.dump(self, file_path)
        print(f"Model saved to {file_path}")
    
    @classmethod
    def load_model(cls, file_path):
        # Load the model using joblib
        loaded_model = joblib.load(file_path)
        return loaded_model

# Sample initial dataset (including prescription information)
initial_data = pd.DataFrame({
    "tailleCm": [170, 160],
    "poidsKg": [70, 60],
    "groupeSanguin": ["A+", "O-"],
    "IMC": [24.22, 23.44],
    "age": [30, 45],
    "sexe": ["M", "F"],
    "cin": ["12345678", "87654321"],
    "HTA": ["yes", "no"],
    "diabete": ["no", "yes"],
    "dyslipidemie": ["no", "yes"],
    "autresAntecedentsFamiliaux": ["none", "heart disease"],
    "nbGrossesse": [0, 2],
    "nbEnfantsVivants": [0, 2],
    "nbMacrosomies": [0, 1],
    "nbAvortements": [0, 0],
    "nbMortNes": [0, 0],
    "contraceptionUtilisee": ["none", "pill"],
    "ageMenopause": [0, 50],
    "autresAntecedentsGynecoObstetriques": ["none", "fibroids"],
    "alcoolSemaine": [0, 2],
    "tabacStatus": ["never", "current"],
    "nbCigaretteParJour": [0, 10],
    "drogue": ["no", "no"],
    "autreHabitudeToxique": ["none", "none"],
    "diagnostic": ["healthy", "diabetes"],
    "prescription": ["none", "metformin"]
})

# Instantiate the model
model = DiagnosticModel()

# Fit the initial data
model.fit_initial(initial_data)

# Sample new dataset for retraining
new_data = pd.DataFrame({
    "tailleCm": [165, 175],
    "poidsKg": [65, 80],
    "groupeSanguin": ["B+", "AB-"],
    "IMC": [23.88, 26.12],
    "age": [35, 50],
    "sexe": ["F", "M"],
    "cin": ["12345987", "87654231"],
    "HTA": ["no", "yes"],
    "diabete": ["yes", "no"],
    "dyslipidemie": ["yes", "no"],
    "autresAntecedentsFamiliaux": ["diabetes", "hypertension"],
    "nbGrossesse": [1, 0],
    "nbEnfantsVivants": [1, 0],
    "nbMacrosomies": [0, 0],
    "nbAvortements": [0, 0],
    "nbMortNes": [0, 0],
    "contraceptionUtilisee": ["iud", "none"],
    "ageMenopause": [0, 0],
    "autresAntecedentsGynecoObstetriques": ["pcos", "none"],
    "alcoolSemaine": [1, 3],
    "tabacStatus": ["former", "never"],
    "nbCigaretteParJour": [0, 0],
    "drogue": ["no", "no"],
    "autreHabitudeToxique": ["none", "none"],
    "diagnostic": ["hypertension", "healthy"],
    "prescription": ["lisinopril", "none"]
})

# Retrain the model with new data
model.fit_retrain(new_data)

# Sample new data for prediction
new_patient = pd.DataFrame({
    "tailleCm": [172],
    "poidsKg": [74],
    "groupeSanguin": ["A+"],
    "IMC": [25.00],
    "age": [33],
    "sexe": ["M"],
    "cin": ["11112222"],
    "HTA": ["yes"],
    "diabete": ["no"],
    "dyslipidemie": ["yes"],
    "autresAntecedentsFamiliaux": ["none"],
    "nbGrossesse": [0],
    "nbEnfantsVivants": [0],
    "nbMacrosomies": [0],
    "nbAvortements": [0],
    "nbMortNes": [0],
    "contraceptionUtilisee": ["none"],
    "ageMenopause": [0],
    "autresAntecedentsGynecoObstetriques": ["none"],
    "alcoolSemaine": [0],
    "tabacStatus": ["never"],
    "nbCigaretteParJour": [0],
    "drogue": ["no"],
    "autreHabitudeToxique": ["none"],
    "diagnostic": ["healthy"]
})

# Predict prescription for new patient
predicted_prescriptions = model.predict_prescription(new_patient)
print(predicted_prescriptions)
