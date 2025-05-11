from django.urls import path
from .views import welcome,PredictAPIView,TrainAPIView

urlpatterns = [
    path('welcome',welcome),
    path('predict/', PredictAPIView.as_view(), name='predict'),
    path('train/', TrainAPIView.as_view(), name='train'),
]
