import pandas as pd
import random
from faker import Faker
import numpy as np

class SyntheticDataGenerator:
    def __init__(self):
        self.fake = Faker()
        self.GENDER_CHOICES = ['male', 'female']
        self.BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
        self.TOBACCO_STATUS = ['current smoker', 'ex-smoker', 'never smoked']
        self.diagnoses = {
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
        self.prescriptions = {
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

    def generate_diagnostic(self):
        diagnosis = random.choice(list(self.diagnoses.keys()))
        symptoms_list = self.diagnoses[diagnosis]
        diagnostic_text = f"Patient shows symptoms of {symptoms_list[0]} and {symptoms_list[1]}. Diagnosed with {diagnosis}."
        prescription = self.prescriptions[diagnosis]
        return diagnostic_text, prescription

    def generate_synthetic_row(self):
        diagnostic, prescription = self.generate_diagnostic()
        return {
            "tailleCm": random.randint(150, 200),
            "poidsKg": random.randint(50, 120),
            "groupeSanguin": random.choice(self.BLOOD_GROUPS),
            "IMC": round(random.uniform(18.5, 30.0), 2),
            "age": random.randint(18, 80),
            "sexe": random.choice(self.GENDER_CHOICES),
            "cin": self.fake.ssn(),
            "HTA": random.choice([True, False]),
            "diabete": random.choice([True, False]),
            "dyslipidemie": random.choice([True, False]),
            "autresAntecedentsFamiliaux": self.fake.text(max_nb_chars=20),
            "nbGrossesse": random.randint(0, 10),
            "nbEnfantsVivants": random.randint(0, 10),
            "nbMacrosomies": random.randint(0, 10),
            "nbAvortements": random.randint(0, 10),
            "nbMortNes": random.randint(0, 10),
            "contraceptionUtilisee": random.choice([True, False]),
            "ageMenopause": random.randint(45, 55) if random.choice([True, False]) else np.nan,
            "autresAntecedentsGynecoObstetriques": self.fake.text(max_nb_chars=20),
            "alcoolSemaine": random.randint(0, 10),
            "tabacStatus": random.choice(self.TOBACCO_STATUS),
            "nbCigaretteParJour": random.randint(0, 40),
            "exFumerDate": self.fake.date_this_decade().isoformat() if random.choice([True, False]) else np.nan,
            "drogue": random.choice([True, False]),
            "autreHabitudeToxique": self.fake.text(max_nb_chars=20),
            "diagnostic": diagnostic,
            "prescription": prescription
        }

    def generate_synthetic_data(self, num_samples):
        data = [self.generate_synthetic_row() for _ in range(num_samples)]
        return pd.DataFrame(data)
