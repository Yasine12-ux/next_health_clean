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
import os
# Download NLTK data
nltk.download('punkt')
nltk.download('stopwords')

class DiagnosticModel:
    
    DIAGNOSTIC_WEIGHT = 10  # Increase weight for diagnostic text
    
    
    MODEL_PATH = 'diagnostic_model.joblib'
    VECTORIZER_AF_PATH = 'vectorizerAF.joblib'
    VECTORIZER_AG_PATH = 'vectorizerAG.joblib'
    VECTORIZER_HT_PATH = 'vectorizerHT.joblib'
    VECTORIZER_DIAGNOSTIC_PATH = 'vectorizerDiagnostic.joblib'
    DATA_PATH = 'data.csv'
    
    
    MODEL_FEATURES = ["tailleCm", "poidsKg", "groupeSanguin", "IMC", "age", "sexe", "HTA", "diabete", 
                      "dyslipidemie", "autresAntecedentsFamiliaux", "nbGrossesse", "nbEnfantsVivants", 
                      "nbMacrosomies", "nbAvortements", "nbMortNes", "contraceptionUtilisee", "ageMenopause", 
                      "autresAntecedentsGynecoObstetriques", "alcoolSemaine", "tabacStatus", "nbCigaretteParJour", 
                      "drogue", "autreHabitudeToxique", "diagnostic", "prescription"]
    
    def __init__(self):
        self.max_features_diagnostic = 750  # Define your desired maximum number of features for TF-IDF vectorizers
        self.max_features_AF = 250
        self.max_features_AG = 250
        self.max_features_HT = 250
        
        self.vectorizerAF = TfidfVectorizer(max_features=self.max_features_AF)
        self.vectorizerAG = TfidfVectorizer(max_features=self.max_features_AG)
        self.vectorizerHT = TfidfVectorizer(max_features=self.max_features_HT)
        self.vectorizerDiagnostic = TfidfVectorizer(max_features=self.max_features_diagnostic)
        
        self.knn = NearestNeighbors(metric="cosine", algorithm="brute")
                                
        # Define numeric and categorical features
        self.numeric_features = ['tailleCm', 'poidsKg', 'IMC', 'nbGrossesse', 'nbEnfantsVivants',
                                 'nbMacrosomies', 'nbAvortements', 'nbMortNes', 'ageMenopause',
                                 'alcoolSemaine', 'nbCigaretteParJour', 'age']
        self.categorical_features = ['groupeSanguin', 'HTA', 'diabete', 'dyslipidemie', 'tabacStatus', 'drogue']
        


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
        
        self.data = pd.DataFrame()  # Store all data for retraining
        
        self.load_model() # Load the model if it exists

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
        X_AF = self.vectorizerAF.transform(data['clean_autresAntecedentsFamiliaux']).toarray()
        X_AG = self.vectorizerAG.transform(data['clean_autresAntecedentsGynecoObstetriques']).toarray()
        X_HT = self.vectorizerHT.transform(data['clean_autreHabitudeToxique']).toarray()
        X_Diag = self.vectorizerDiagnostic.transform(data['clean_diagnostic']).toarray() * self.DIAGNOSTIC_WEIGHT # Increase weight for diagnostic text
        
 
        
        
        if X_AF.shape[1] < self.max_features_AF:
            X_AF = np.hstack((X_AF, np.zeros((X_AF.shape[0], self.max_features_AF - X_AF.shape[1]))))
        if X_AG.shape[1] < self.max_features_AG:
            X_AG = np.hstack((X_AG, np.zeros((X_AG.shape[0], self.max_features_AG - X_AG.shape[1]))))
        if X_HT.shape[1] < self.max_features_HT:
            X_HT = np.hstack((X_HT, np.zeros((X_HT.shape[0], self.max_features_HT - X_HT.shape[1]))))
        if X_Diag.shape[1] < self.max_features_diagnostic:
            X_Diag = np.hstack((X_Diag, np.zeros((X_Diag.shape[0], self.max_features_diagnostic - X_Diag.shape[1]))))

        print("X_AF",X_AF.shape)
        print("X_AG",X_AG.shape)
        print("X_HT",X_HT.shape)
        print("X_Diag",X_Diag.shape)
        
        # Handle numeric and categorical features
        try:
            X_preprocessed = self.preprocessor.transform(data[self.numeric_features + self.categorical_features])
        except NotFittedError:
            self.preprocessor.fit(data[self.numeric_features + self.categorical_features])
            X_preprocessed = self.preprocessor.transform(data[self.numeric_features + self.categorical_features])

        print("X_preprocessed",X_preprocessed.shape)
        # Concatenate all features
        X_combined = np.hstack((X_preprocessed, X_AF, X_AG, X_HT, X_Diag))
        return X_combined

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
        
        X,Y = self.preprocess_data(self.data),self.data["prescription"]
        
        # Adjust n_neighbors to not exceed the number of samples
        n_neighbors = min(5, len(X))
        self.knn.set_params(n_neighbors=n_neighbors)
        
        self.knn.fit(X,Y)
        
        self.save_model()
        

    def predict(self, new_data):
        X_new = self.preprocess_data(new_data)
        print(X_new.shape)
        distances, indices = self.knn.kneighbors(X_new)
        return distances, indices

    def predict_prescription(self, new_data):
        distances, indices = self.predict(new_data)
        print("indices",indices)
        prescriptions = self.data.iloc[indices.flatten()]['prescription']
        return prescriptions

    def save_model(self):
        # Save the model using joblib
        
        if not os.path.exists('models'):
            os.makedirs('models')
            
        joblib.dump(self.knn, self.MODEL_PATH)
        joblib.dump(self.vectorizerAF, self.VECTORIZER_AF_PATH)
        joblib.dump(self.vectorizerAG, self.VECTORIZER_AG_PATH)
        joblib.dump(self.vectorizerHT, self.VECTORIZER_HT_PATH)
        joblib.dump(self.vectorizerDiagnostic, self.VECTORIZER_DIAGNOSTIC_PATH)
        self.data.to_csv(self.DATA_PATH, index=False)
    
    def load_model(self):
        if not os.path.exists(self.MODEL_PATH) or not os.path.exists(self.VECTORIZER_AF_PATH) or not os.path.exists(self.VECTORIZER_AG_PATH) or not os.path.exists(self.VECTORIZER_HT_PATH) or not os.path.exists(self.VECTORIZER_DIAGNOSTIC_PATH) or not os.path.exists(self.DATA_PATH):
            return 
        
        # Load the model using joblib
        self.knn = joblib.load(self.MODEL_PATH)
        self.vectorizerAF = joblib.load(self.VECTORIZER_AF_PATH)
        self.vectorizerAG = joblib.load(self.VECTORIZER_AG_PATH)
        self.vectorizerHT = joblib.load(self.VECTORIZER_HT_PATH)
        self.vectorizerDiagnostic = joblib.load(self.VECTORIZER_DIAGNOSTIC_PATH)
        self.data = pd.read_csv(self.DATA_PATH)        



if True: #  __name__ == '__main__':
    # Sample initial dataset (including prescription information)
    initial_data = pd.DataFrame({
        "tailleCm": [170, 160],
        "poidsKg": [70, 60],
        "groupeSanguin": ["A+", "O-"],
        "IMC": [24.22, 23.44],
        "age": [30, 45],
        "sexe": ["M", "F"],
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

    # Sample new dataset for retraining
    new_data = pd.DataFrame({
        "tailleCm": [165, 175],
        "poidsKg": [65, 80],
        "groupeSanguin": ["B+", "AB-"],
        "IMC": [23.88, 26.12],
        "age": [35, 50],
        "sexe": ["F", "M"],
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
    # Predict prescription for new patient
    predicted_prescriptions = model.predict_prescription(new_patient)
    print(predicted_prescriptions)