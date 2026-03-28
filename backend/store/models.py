from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator

from django.db import models
from django.db.models import Avg
from django.utils import timezone

# Create your models here.

class User(AbstractUser):
    pass


class Category(models.Model):
    name = models.CharField(max_length=100)
    # To keep a standar category
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")
    description = models.TextField()
    quantity = models.IntegerField()
    materials = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
    # Add main image to the product catalog
    def main_image(self, request):
        first_image = self.images.first()
        if first_image:
            return request.build_absolute_uri(first_image.image.url)
        else:
            return None

    def serialize(self, request):
        local_time = timezone.localtime(self.created_at)
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category.slug,
            "description": self.description,
            "quantity": self.quantity,
            "materials": self.materials,
            # Float convertion to avoid errors
            "price": float(self.price),
            # Main image
            "main_image": self.main_image(request),
            "created_at": local_time.strftime(" %d-%m-%Y"),
            "updated_at": local_time.strftime(" %d-%m-%Y"),

            # Serialize another  product information right away
            "ratings": [rating.serialize() for rating in self.ratings.all()],
            # Avg returns a dict avg= and ["avg"] returns {"rating_avg": 3.5}
            "rating_avg": (
                self.ratings.aggregate(avg=Avg("rating"))["avg"]
                if self.ratings.exists() else None
                ),
            "comments": [comment.serialize() for comment in self.comments.all()], 
        }


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    # Add the fields on settings.py
    image = models.ImageField(upload_to="products/")
    alt_text = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"Image for {self.product.name}"
        
    def serialize(self, request=None):
        return {
            "id": self.id,
            "product_id": self.product.id,
            # Requiered to send the absolute path of the image
            "image": request.build_absolute_uri(self.image.url),
            "alt_text": self.alt_text,
        }


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="comments")
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def serialize(self):
        local_time = timezone.localtime(self.created_at)
        return {
            "id": self.id,
            "product_id": self.product.id,
            "user_id": self.user.id,
            "username": self.user.username,
            "comment": self.comment,
            "created_at": local_time.strftime("Commented at: %d-%m-%Y"), 
        }


class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ratings")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="ratings")
    # Avoid ratings outside the range 1-5 from the model itself
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)])
    created_at = models.DateTimeField(auto_now_add=True)

    # Avoid duplicate ratings from the model itself
    class Meta:
        unique_together = ("user", "product")

    def serialize(self):
        local_time = timezone.localtime(self.created_at)
        return {
            "id": self.id,
            "product_id": self.product.id,
            "user_id": self.user.id,
            "username": self.user.username,
            "rating": self.rating,
            "created_at": local_time.strftime("Rated at: %d-%m-%Y"), 
        }


class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="wishlist")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="wishlist")
    added_at = models.DateTimeField(auto_now_add=True)

    # Avoid duplicate products on wishlist from the model itself
    class Meta:
        unique_together = ("user", "product")


class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cart")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="cart")
    # Avoid adding 0 items to the cart from the model itself
    quantity = models.IntegerField(
        validators=[MinValueValidator(1)])
    added_at = models.DateTimeField(auto_now_add=True)
    
    # Avoid duplicate products on cart from the model itself
    class Meta:
        unique_together = ("user", "product")
    

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="order_items")
    # Avoid adding 0 items to an order from the model itself
    quantity = models.IntegerField(
        validators=[MinValueValidator(1)])
    added_at = models.DateTimeField(auto_now_add=True)