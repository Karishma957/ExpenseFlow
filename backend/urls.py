from django.contrib import admin
from django.urls import path
from api import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/expenses/', views.expense_list),
    path('api/expenses/<int:pk>/', views.expense_detail),
]