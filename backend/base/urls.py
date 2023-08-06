from django.urls import path
from . import views

urlpatterns = [
    path('', views.getRoutes, name='routes'),
    path('transactions/', views.getTransactions, name='transactions'),
    path('transactions/<str:pk>/', views.getTransaction, name='transaction')
]