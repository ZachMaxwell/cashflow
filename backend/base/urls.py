from django.urls import path
from . import views


urlpatterns = [

    path('login/', views.login_view, name='login'),
    path('', views.getRoutes, name='routes'),
    path('transactions/', views.getTransactions, name='transactions'),
    path('transactions/create/', views.createTransaction, name='transaction-create'),
    path('transactions/delete/<str:pk>/', views.deleteTransaction, name='transaction-delete'),
    path('transactions/update/<str:pk>/', views.updateTransaction, name='transaction-update'),
    path('transactions/<str:pk>/', views.getTransaction, name='transaction'),
    path('transaction-model-fields-and-types/', views.get_transaction_model_fields_and_types, name='transaction-model-fields-and-types'),
    
]
