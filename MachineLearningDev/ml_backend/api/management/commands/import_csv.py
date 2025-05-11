import pandas as pd
from django.core.management.base import BaseCommand, CommandError
from ...models import Consultation,Ordonnance

class Command(BaseCommand):
    help = 'Import data from CSV file to the Consultation model'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to the CSV file')

    def handle(self, *args, **kwargs):
        csv_file = kwargs['csv_file']

        try:
            df = pd.read_csv(csv_file)

            for i, row in df.iterrows():
                consultation = Consultation(
                taille_cm=row['tailleCm'],
                poids_kg=row['poidsKg'],
                groupe_sanguin=row['groupeSanguin'],
                imc=row['IMC'],
                adresse=row['adresse'],
                hta=row['HTA'].lower() == 'oui',
                diabete=row['diabete'].lower() == 'oui',
                dyslipidemie=row['dyslipidemie'].lower() == 'oui',
                nb_grossesse=row['nbGrossesse'],
                nb_enfants_vivants=row['nbEnfantsVivants'],
                nb_macrosomies=row['nbMacrosomies'],
                nb_avortements=row['nbAvortements'],
                nb_mort_nes=row['nbMortNes'],
                age_menopause=row['ageMenopause'],
                alcool_semaine=row['alcoolSemaine'],
                tabac_status=row['tabacStatus'],
                nb_cigarette_par_jour=row['nbCigaretteParJour'],
                drogue=row['drogue'].lower() == 'oui',
                age=row['Age'],
                sexe=row['sexe'],
                diagnostic=row['Description'] 
                )
                consultation.save()
                
                ordonnance = Ordonnance(
                    index = i,
                    description=row['Ordonnance']
                )
                ordonnance.save()
                
            

            self.stdout.write(self.style.SUCCESS('Successfully imported data from CSV'))
        except FileNotFoundError:
            raise CommandError(f'CSV file "{csv_file}" does not exist')
        except pd.errors.EmptyDataError:
            raise CommandError('No data in the CSV file')
        except KeyError as e:
            raise CommandError(f'Missing column in CSV file: {e}')
        except Exception as e:
            raise CommandError(f'Error importing data: {e}')
