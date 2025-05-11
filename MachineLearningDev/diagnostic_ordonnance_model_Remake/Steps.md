# First Train

```python
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import string
import nltk
import numpy as np

# Download NLTK data
nltk.download('punkt')
nltk.download('stopwords')

# Define the clean_text function
def clean_text(text):
    text = text.lower()
    text = text.translate(str.maketrans('', '', string.punctuation))
    tokens = word_tokenize(text)
    tokens = [word for word in tokens if word not in stopwords.words('english')]
    return ' '.join(tokens)

# Create synthetic data with additional patient features
synthetic_data = pd.DataFrame({
    'diagnostic': [
        "Patient shows symptoms of acute bronchitis.",
        "Patient has a high fever and sore throat.",
        "Diagnosis of mild asthma.",
        "Patient complains of severe headache and nausea.",
        "Patient reports joint pain and swelling."
    ],
    'age': [45, 30, 25, 50, 60],
    'weight': [70, 80, 60, 90, 75],
    'gender': ['male', 'female', 'female', 'male', 'male'],
    'alcohol': [1, 0, 0, 1, 1],
    'tobacco': [1, 0, 1, 1, 0],
    'prescription': [
        ["Cough syrup", "Rest"],
        ["Antibiotics", "Rest"],
        ["Inhaler", "Avoid allergens"],
        ["Pain relievers", "Hydration"],
        ["Anti-inflammatory drugs", "Rest"]
    ]
})

# Preprocess the synthetic data
synthetic_data['clean_diagnostic'] = synthetic_data['diagnostic'].apply(clean_text)

# Convert the cleaned diagnostic texts into TF-IDF vectors
vectorizer = TfidfVectorizer()
X_text = vectorizer.fit_transform(synthetic_data['clean_diagnostic'])

# Encode categorical data (e.g., gender) and scale numerical data
synthetic_data['gender'] = synthetic_data['gender'].map({'male': 0, 'female': 1})
patient_features = synthetic_data[['age', 'weight', 'gender', 'alcohol', 'tobacco']]
scaler = StandardScaler()
X_patient = scaler.fit_transform(patient_features)

# Combine TF-IDF vectors with patient features
X_combined = np.hstack((X_text.toarray(), X_patient))

# Train a k-NN model on the combined features
knn = NearestNeighbors(n_neighbors=min(5, len(synthetic_data)), metric='cosine')
knn.fit(X_combined)

```







# Update the model ( extra train )
```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
import numpy as np
import pandas as pd

# Assume the following are previously defined and fitted:
# - vectorizer (TfidfVectorizer)
# - scaler (StandardScaler)
# - knn (KNeighborsClassifier)
# - synthetic_data (original dataset with prescriptions)
# - X_combined (original combined feature set)

# Function to clean text (placeholder, replace with actual implementation)
def clean_text(text):
    return text.lower()

# Function to update the model with new data
def update_model(new_data):
    global X_combined, knn, vectorizer, scaler, synthetic_data
    
    # Preprocess the new data
    new_data['clean_diagnostic'] = new_data['diagnostic'].apply(clean_text)
    
    # Combine old and new text data
    combined_diagnostics = pd.concat([synthetic_data['diagnostic'], new_data['diagnostic']])
    combined_clean_diagnostics = combined_diagnostics.apply(clean_text)
    
    # Refit TF-IDF vectorizer with combined data
    vectorizer = TfidfVectorizer()
    combined_X_text = vectorizer.fit_transform(combined_clean_diagnostics)
    
    # Transform the new text data
    new_X_text = vectorizer.transform(new_data['clean_diagnostic'])
    
    # Update scaler with new patient features
    new_data['gender'] = new_data['gender'].map({'male': 0, 'female': 1})
    new_patient_features = new_data[['age', 'weight', 'gender', 'alcohol', 'tobacco']]
    
    # Fit scaler with combined patient features
    combined_patient_features = pd.concat([synthetic_data[['age', 'weight', 'gender', 'alcohol', 'tobacco']], new_patient_features])
    scaler.fit(combined_patient_features)
    combined_X_patient = scaler.transform(combined_patient_features)
    
    # Transform the new patient features
    new_X_patient = scaler.transform(new_patient_features)
    
    # Combine new features
    new_X_combined = np.hstack((new_X_text.toarray(), new_X_patient))
    
    # Combine old and new features
    X_combined = np.vstack((combined_X_text.toarray(), new_X_patient))
    
    # Refit k-NN model
    knn.fit(X_combined, synthetic_data['prescription'])

# Example new data
new_data = pd.DataFrame({
    'diagnostic': ["Patient reports chest pain and shortness of breath."],
    'age': [50],
    'weight': [80],
    'gender': ['male'],
    'alcohol': [1],
    'tobacco': [1],
    'prescription': [["Aspirin", "Rest"]]
})

# Update the model with new data
update_model(new_data)

# Define the recommendation function
def recommend_prescriptions(diagnostic_text, patient_data):
    cleaned_text = clean_text(diagnostic_text)
    vec_text = vectorizer.transform([cleaned_text])
    vec_patient = scaler.transform([patient_data])
    vec_combined = np.hstack((vec_text.toarray(), vec_patient))
    distances, indices = knn.kneighbors(vec_combined, n_neighbors=min(5, len(X_combined)))
    similar_prescriptions = [synthetic_data['prescription'].iloc[i] for i in indices.flatten()]
    return similar_prescriptions

# Test the updated recommendation function with a new diagnostic and patient data
new_diagnostic = "Patient complains of shortness of breath."
new_patient_data = [55, 65, 0, 1, 1]  # age, weight, gender (0 for male), alcohol, tobacco
recommended_prescriptions = recommend_prescriptions(new_diagnostic, new_patient_data)
print(recommended_prescriptions)
```