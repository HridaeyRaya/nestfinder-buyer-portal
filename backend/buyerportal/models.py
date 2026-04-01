from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Favourite(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    item_name = models.CharField(max_length = 255)
    image_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.item_name}" 