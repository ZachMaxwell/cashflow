from django.urls import path
from . import views

    


urlpatterns = [

    path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/register/', views.registerUser, name='register'),
    path('users/profile/', views.getUserProfile, name='user-profile'),
    path('users/', views.getUsers, name='users'),
    path('transactions/', views.getTransactions, name='transactions'),
    path('transactions/create/', views.createTransaction, name='transaction-create'),
    path('transactions/delete/<str:pk>/', views.deleteTransaction, name='transaction-delete'),
    path('transactions/update/<str:pk>/', views.updateTransaction, name='transaction-update'),
    path('transactions/<str:pk>/', views.getTransaction, name='transaction'),
    path('transaction-model-fields-and-types/', views.get_transaction_model_fields_and_types, name='transaction-model-fields-and-types'),
    path('transaction-model-form-data-choices/', views.get_transaction_model_form_data_choices, name='transaction-model-form-data-choices'),
    
]
