from django.urls import path
from .views import RegisterView, LoginView, AddFavourite, ListFavourite, DeleteFavourite

urlpatterns = [
    # Auth
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    
    # Models
    path('favourites/', ListFavourite.as_view()),
    path('favourites/add/', AddFavourite.as_view()),
    path('favourites/delete/<int:id>/', DeleteFavourite.as_view()),

]