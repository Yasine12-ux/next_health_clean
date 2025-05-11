from django.shortcuts import render
from django.http import HttpResponse
# from .knn_model import KNNModel
import pandas as pd
from .serializers import ConsultationSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import Ordonnance
from .knn_modelV2 import DiagnosticModel

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json

knn_model = DiagnosticModel()


def welcome(request):
    return HttpResponse("<h1>welcome</h1>")

class PredictAPIView(APIView):

    def post(self, request, *args, **kwargs):
        keys = ["tailleCm",
                "poidsKg", 
                "groupeSanguin",
                "IMC", 
                "age", 
                "sexe",
                "HTA",
                "diabete", 
                "dyslipidemie",
                "autresAntecedentsFamiliaux",
                "nbGrossesse", 
                "nbEnfantsVivants", 
                "nbMacrosomies",
                "nbAvortements", 
                "nbMortNes", 
                "contraceptionUtilisee",
                "ageMenopause", 
                "autresAntecedentsGynecoObstetriques",
                "alcoolSemaine", 
                "tabacStatus", 
                "nbCigaretteParJour",
                "drogue", 
                "autreHabitudeToxique", 
                "diagnostic"]
        try:
            data = request.data  
            print(data)
            
            if not all(key in data for key in keys):
                missing_fields = [key for key in keys if key not in data]
                
                return Response({"error": "Missing required fields."+str(missing_fields)}, status=status.HTTP_400_BAD_REQUEST)
            
            # Perform prediction logic (dummy example here)
            # Replace with your actual prediction logic based on your use case
            df = pd.DataFrame([data])  # Creating DataFrame from data dictionary
            print("shape",df.shape)
            prescription = knn_model.predict_prescription(df)
            return Response({"prescription": prescription})

        except Exception as e:
            print(e)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TrainAPIView(APIView):

    def post(self, request, *args, **kwargs):
        keys = ["tailleCm", "poidsKg", "groupeSanguin", "IMC", "age", "sexe",
                                            "HTA", "diabete", "dyslipidemie", "autresAntecedentsFamiliaux",
                                            "nbGrossesse", "nbEnfantsVivants", "nbMacrosomies",
                                            "nbAvortements", "nbMortNes", "contraceptionUtilisee",
                                            "ageMenopause", "autresAntecedentsGynecoObstetriques",
                                            "alcoolSemaine", "tabacStatus", "nbCigaretteParJour",
                                            "drogue", "autreHabitudeToxique", "diagnostic","prescription"]
        try:
            data = request.data  # Assuming JSON data is sent in the request body
            # Process and validate incoming data (you can use serializers here)
            # Example validation, adjust as per your serializer or data structure
            if not all(key in data for key in keys):
                missing_fields = [key for key in keys if key not in data]
                
                return Response({"error": "Missing required fields."+str(missing_fields)}, status=status.HTTP_400_BAD_REQUEST)
            # Perform prediction logic (dummy example here)
            # Replace with your actual prediction logic based on your use case
            
    
            df = pd.DataFrame([data])  # Creating DataFrame from data dictionary
            df.replace({'autresAntecedentsFamiliaux':{None:""}},inplace=True)
            df.replace({'autresAntecedentsGynecoObstetriques':{None:""}},inplace=True)
            df.replace({'autreHabitudeToxique':{None:""}},inplace=True)
            df.replace({'diagnostic':{None:""}},inplace=True)
            
            # Continue with your processing logic
            
            knn_model.fit_retrain(df)
            return Response({"message": "Model trained successfully."})
        except Exception as e:
            print(e)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)