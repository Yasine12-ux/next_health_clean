import pandas as pd
import numpy as np
import random
from faker import Faker
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import string
import nltk
from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_score, recall_score

# Download NLTK data
nltk.download('punkt')
nltk.download('stopwords')

# Initialize Faker
fake = Faker()

# Define some constants and helper functions for generating synthetic data
GENDER_CHOICES = ['male', 'female']
BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
TOBACCO_STATUS = ['current smoker', 'ex-smoker', 'never smoked']
CONTRACEPTION_CHOICES = ['pill', 'IUD', 'implant', 'condom', 'none']

# Define symptoms, diagnoses, and prescriptions
symptoms = ["cough", "fever", "sore throat", "headache", "nausea", "joint pain",
            "shortness of breath", "abdominal pain", "rash", "dizziness", "blurred vision",
            "chest pain", "fatigue", "muscle pain", "swelling"]
diagnoses = {
    "acute bronchitis": ["cough", "fever"],
    "mild asthma": ["shortness of breath", "wheezing"],
    "severe headache": ["headache", "nausea"],
    "joint pain": ["joint pain", "swelling"],
    "chronic back pain": ["back pain", "fatigue"],
    "skin infection": ["rash", "fever"],
    "stomach flu": ["nausea", "abdominal pain"],
    "high blood pressure": ["headache", "dizziness"],
    "migraine": ["headache", "blurred vision"],
    "allergic reaction": ["rash", "shortness of breath"]
}
prescriptions = {
    "acute bronchitis": ["Cough syrup", "Rest"],
    "mild asthma": ["Inhaler", "Bronchodilator"],
    "severe headache": ["Pain relievers", "Hydration"],
    "joint pain": ["Anti-inflammatory drugs", "Physical therapy"],
    "chronic back pain": ["Painkillers", "Physical therapy"],
    "skin infection": ["Antibiotics", "Hydration"],
    "stomach flu": ["Antiemetics", "Hydration"],
    "high blood pressure": ["Antihypertensives", "Lifestyle changes"],
    "migraine": ["Pain relievers", "Rest"],
    "allergic reaction": ["Antihistamines", "Epinephrine"]
}

# Function to generate a diagnostic and corresponding prescription
def generate_diagnostic():
    diagnosis = random.choice(list(diagnoses.keys()))
    symptoms_list = diagnoses[diagnosis]
    diagnostic_text = f"Patient shows symptoms of {symptoms_list[0]} and {symptoms_list[1]}. Diagnosed with {diagnosis}."
    prescription = prescriptions[diagnosis]
    return diagnostic_text, prescription

# Function to generate a single row of synthetic data
def generate_synthetic_row():
    diagnostic, prescription = generate_diagnostic()
    return {
        "tailleCm": random.randint(150, 200),
        "poidsKg": random.randint(50, 120),
        "groupeSanguin": random.choice(BLOOD_GROUPS),
        "IMC": round(random.uniform(18.5, 30.0), 2),
        "age": random.randint(18, 80),
        "sexe": random.choice(GENDER_CHOICES),
        "cin": fake.ssn(),
        "numTel": fake.phone_number(),
        "adresse": fake.address(),
        "HTA": random.choice([True, False]),
        "diabete": random.choice([True, False]),
        "dyslipidemie": random.choice([True, False]),
        "autresAntecedentsFamiliaux": fake.text(max_nb_chars=20),
        "nbGrossesse": random.randint(0, 10),
        "nbEnfantsVivants": random.randint(0, 10),
        "nbMacrosomies": random.randint(0, 10),
        "nbAvortements": random.randint(0, 10),
        "nbMortNes": random.randint(0, 10),
        "contraceptionUtilisee": random.choice(CONTRACEPTION_CHOICES),
        "ageMenopause": random.randint(45, 55) if random.choice([True, False]) else None,
        "autresAntecedentsGynecoObstetriques": fake.text(max_nb_chars=20),
        "alcoolSemaine": random.randint(0, 10),
        "tabacStatus": random.choice(TOBACCO_STATUS),
        "nbCigaretteParJour": random.randint(0, 40),
        "exFumerDate": fake.date_this_decade().isoformat() if random.choice([True, False]) else None,
        "drogue": random.choice([True, False]),
        "autreHabitudeToxique": fake.text(max_nb_chars=20),
        "diagnostic": diagnostic,
        "prescription": prescription
    }

# Function to generate a DataFrame of synthetic data
def generate_synthetic_data(num_samples):
    data = [generate_synthetic_row() for _ in range(num_samples)]
    return pd.DataFrame(data)

# Generate synthetic data
num_samples = 1000  # Adjust as needed
synthetic_data = generate_synthetic_data(num_samples)

# Define the clean_text function
def clean_text(text):
    text = text.lower()
    text = text.translate(str.maketrans('', '', string.punctuation))
    tokens = word_tokenize(text)
    tokens = [word for word in tokens if word not in stopwords.words('english')]
    return ' '.join(tokens)

# Preprocess the synthetic data
synthetic_data['clean_diagnostic'] = synthetic_data['diagnostic'].apply(clean_text)

# Convert the cleaned diagnostic texts into TF-IDF vectors
vectorizer = TfidfVectorizer()
X_text = vectorizer.fit_transform(synthetic_data['clean_diagnostic'])

# Encode categorical data (e.g., gender, blood group, contraception used) and scale numerical data
synthetic_data['sexe'] = synthetic_data['sexe'].map({'male': 0, 'female': 1})
synthetic_data = pd.get_dummies(synthetic_data, columns=['groupeSanguin', 'tabacStatus', 'contraceptionUtilisee'], drop_first=True)
patient_features = synthetic_data.drop(columns=['diagnostic', 'prescription', 'clean_diagnostic'])
scaler = StandardScaler()
X_patient = scaler.fit_transform(patient_features)

# Combine TF-IDF vectors with patient features
X_combined = np.hstack((X_text.toarray(), X_patient))

# Train a k-NN model on the combined features
knn = NearestNeighbors(n_neighbors=5, metric='cosine')
knn.fit(X_combined)

# Define the recommendation function
def recommend_prescriptions(diagnostic_text, patient_data):
    cleaned_text = clean_text(diagnostic_text)
    vec_text = vectorizer.transform([cleaned_text])
    vec_patient = scaler.transform([patient_data])
    vec_combined = np.hstack((vec_text.toarray(), vec_patient))
    distances, indices = knn.kneighbors(vec_combined, n_neighbors=5)
    similar_prescriptions = [synthetic_data['prescription'].iloc[i] for i in indices.flatten()]
    return similar_prescriptions

# Evaluate the model
def evaluate_model():
    y_true = []
    y_pred = []
    
    for _, row in test_data.iterrows():
        diagnostic_text = row['diagnostic']
        patient_data = row.drop(['diagnostic', 'prescription', 'clean_diagnostic']).values
        true_prescriptions = row['prescription']
        
        recommendations = recommend_prescriptions(diagnostic_text, patient_data)
        recommended_prescriptions = [item for sublist in recommendations for item in sublist]
        
        y_true.append(true_prescriptions)
        y_pred.append(recommended_prescriptions)
    
    # Calculate precision, recall, MRR, and MAP
    def reciprocal_rank(true_list, pred_list):
        for i, pred in enumerate(pred_list):
            if pred in true_list:
                return 1 / (i + 1)
        return 0

    def average_precision(true_list, pred_list):
        ap = 0
        hits = 0
        for i, pred in enumerate(pred_list):
            if pred in true_list:
                hits += 1
                ap += hits / (i + 1)
        return ap / len(true_list) if true_list else 0

    precisions, recalls, mrrs, maps = [], [], [], []
    for i in range(len(y_true)):
        y_true_flat = y_true[i]
        y_pred_flat = y_pred[i]
        precisions.append(precision_score(y_true_flat, y_pred_flat, average='macro', zero_division=0))
        recalls.append(recall_score(y_true_flat, y_pred_flat, average='macro', zero_division=0))
        mrrs.append(reciprocal_rank(y_true_flat, y_pred_flat))
        maps.append(average_precision(y_true_flat, y_pred_flat))
    
    return np.mean(precisions), np.mean(recalls), np.mean(mrrs), np.mean(maps)

# Split the data into training and testing sets
train_data, test_data = train_test_split(synthetic_data, test_size=0.2, random_state=42)

# Evaluate the model
precision, recall, mrr, map_score = evaluate_model()
print(f"Precision: {precision}")
print(f"Recall: {recall}")
print(f"MRR: {mrr}")
print(f"MAP: {map_score}")
