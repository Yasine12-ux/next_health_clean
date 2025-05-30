# Generated by Django 4.2 on 2024-06-03 23:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Consultation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('taille_cm', models.IntegerField(null=True)),
                ('poids_kg', models.FloatField(null=True)),
                ('groupe_sanguin', models.CharField(max_length=10)),
                ('imc', models.FloatField(null=True)),
                ('adresse', models.CharField(max_length=255)),
                ('hta', models.BooleanField(null=True)),
                ('diabete', models.BooleanField(null=True)),
                ('dyslipidemie', models.BooleanField(null=True)),
                ('nb_grossesse', models.IntegerField(null=True)),
                ('nb_enfants_vivants', models.IntegerField(null=True)),
                ('nb_macrosomies', models.IntegerField(null=True)),
                ('nb_avortements', models.IntegerField(null=True)),
                ('nb_mort_nes', models.IntegerField(null=True)),
                ('age_menopause', models.IntegerField(null=True)),
                ('alcool_semaine', models.IntegerField(null=True)),
                ('tabac_status', models.CharField(max_length=20)),
                ('nb_cigarette_par_jour', models.IntegerField(null=True)),
                ('drogue', models.BooleanField(null=True)),
                ('age', models.IntegerField(null=True)),
                ('sexe', models.CharField(max_length=10)),
                ('diagnostic', models.TextField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Ordonnance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('index', models.IntegerField()),
                ('description', models.TextField(null=True)),
            ],
        ),
        migrations.DeleteModel(
            name='Prediction',
        ),
    ]
