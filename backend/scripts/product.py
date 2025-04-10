import random
import json

# Realistic image URLs grouped by type
image_urls = {
    "men": [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c"
    ],
    "women": [
        "https://images.unsplash.com/photo-1514995669114-b77e9a8a8b6c",
        "https://images.unsplash.com/photo-1556909212-d0fc2fb2a9b0",
        "https://images.unsplash.com/photo-1520975918311-29563f69d3c4"
    ],
    "kids": [
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
        "https://images.unsplash.com/photo-1520975685090-3b13c92b77bd",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2"
    ],
    "accessories": [
        "https://images.unsplash.com/photo-1618354691345-1f6464a04776",
        "https://images.unsplash.com/photo-1584467735871-8c96e0d9768a",
        "https://images.unsplash.com/photo-1616712260389-4f42ec38fd84"
    ]
}

# Sample categories with ids
categories = [
    {"id": 1, "name": "Men - Jackets", "type": "men"},
    {"id": 2, "name": "Women - Skirts", "type": "women"},
    {"id": 3, "name": "Kids - Hoodies", "type": "kids"},
    {"id": 4, "name": "Men - T-Shirts", "type": "men"},
    {"id": 5, "name": "Women - Dresses", "type": "women"},
    {"id": 6, "name": "Kids - T-Shirts", "type": "kids"},
    {"id": 7, "name": "Unisex - Sweatshirts", "type": "men"},
    {"id": 8, "name": "Accessories", "type": "accessories"},
    {"id": 9, "name": "Footwear", "type": "accessories"}
]

brands = ["Nike", "Adidas", "Zara", "H&M", "Uniqlo", "Levi's", "Puma", "Under Armour"]
descriptions = [
    "High quality and comfortable",
    "Made from premium materials",
    "Perfect for all seasons",
    "Durable and stylish",
    "Available in various sizes and colors",
    "Trendy and modern design",
    "Best suited for casual outings",
    "A must-have in your wardrobe",
    "Inspired by latest fashion trends"
]

product_names = [
    "Classic Jacket", "Denim Jacket", "Bomber Jacket", "Parka", "Puffer Jacket",
    "Pleated Skirt", "Mini Skirt", "Maxi Skirt", "A-Line Skirt", "Wrap Skirt",
    "Kids Hoodie", "Pullover Hoodie", "Zipper Hoodie", "Graphic Hoodie", "Cropped Hoodie",
    "Graphic Tee", "Plain T-Shirt", "V-Neck T-Shirt", "Oversized Tee", "Striped Tee",
    "Summer Dress", "Evening Dress", "Casual Dress", "Midi Dress", "Bodycon Dress",
    "Kids Tee", "Cartoon Tee", "Funny Print Tee", "Bright Color Tee", "Animal Print Tee",
    "Sweatshirt", "Fleece Sweatshirt", "Crewneck Sweatshirt", "Zip Sweatshirt", "Hooded Sweatshirt",
    "Cap", "Scarf", "Sunglasses", "Backpack", "Watch",
    "Sneakers", "Loafers", "Boots", "Sandals", "Flip Flops"
]

products = []
for i in range(1, 101):
    category = random.choice(categories)
    product = {
        "id": i,
        "name": random.choice(product_names),
        "description": random.choice(descriptions),
        "brand": random.choice(brands),
        "price": round(random.uniform(19.99, 149.99), 2),
        "category_id": category["id"],
        "image_url": random.choice(image_urls[category["type"]])
    }
    products.append(product)

# Return the JSON string

print("-----------------------------------------")
print(json.dumps(products, indent=2))
