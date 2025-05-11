from django.db import models

class Consultation(models.Model):
    taille_cm = models.IntegerField( null=True)
    poids_kg = models.FloatField( null=True)
    groupe_sanguin = models.CharField(max_length=10)
    imc = models.FloatField( null=True)
    adresse = models.CharField(max_length=255)
    hta = models.BooleanField( null=True)
    diabete = models.BooleanField( null=True)
    dyslipidemie = models.BooleanField( null=True)
    nb_grossesse = models.IntegerField( null=True)
    nb_enfants_vivants = models.IntegerField( null=True)
    nb_macrosomies = models.IntegerField( null=True)
    nb_avortements = models.IntegerField( null=True)
    nb_mort_nes = models.IntegerField( null=True)
    age_menopause = models.IntegerField( null=True)
    alcool_semaine = models.IntegerField( null=True)
    tabac_status = models.CharField(max_length=20)
    nb_cigarette_par_jour = models.IntegerField( null=True)
    drogue = models.BooleanField( null=True)
    age = models.IntegerField( null=True)
    sexe = models.CharField(max_length=10)
    diagnostic = models.TextField( null=True)

class Ordonnance(models.Model):
    index =  models.IntegerField()
    description = models.TextField()
