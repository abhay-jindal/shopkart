import random
import json

# Unsplash HD image URLs (you can expand this list)
UNSPLASH_IMAGES = [
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBwYXJlbHxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGFwcGFyZWx8ZW58MHx8MHx8fDA%3D",
    "https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?q=80&w=2078&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjJ8fGFwcGFyZWx8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFnc3xlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTA0fHxhcHBhcmVsfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTF8fGFwcGFyZWx8ZW58MHx8MHx8fDA%3D"
]

# Predefined category IDs from your structure (1–17)
CATEGORY_IDS = list(range(1, 11))

# Sample product names (feel free to add more)
PRODUCT_NAMES = [
    "Sleek Essential Tee", "City Life Oversized Tee", "Structured Poplin Shirt",
    "Soft Touch Hoodie", "AirLite Zip Jacket", "Modern Fit Polo", "Weekend Co-ord Set",
    "Distressed Indigo Denim", "Urban Tapered Joggers", "Breezy Linen Shorts",
    "Tailored Formal Pants", "Core Gym Tee", "Swift Motion Shorts", "Elite Lounge Set",
    "Tiny Rebel Tee", "Doodle Days Set", "Adventure Ready Set", "Muted Tone Sweatshirt",
    "Layered Collar Tee", "Heritage Button-Up", "Raw Seam Crewneck", "Textured Knit Top",
    "Shadow Wash Jeans", "Box Fit Tank", "Crinkle Cotton Shirt", "Relax Mode Shorts",
    "Crosswalk Windbreaker", "Clean Stitch Polo", "Studio Fit Track Pants",
    "Essential Overshirt", "Noir Relax Tee", "Mono Set Hoodie", "SoftFlex Leggings",
    "Contrast Detail Tee", "Easy Day Co-ord", "Comfy Fit Set", "Trek Shorts",
    "Grid Pocket Jacket", "Tonal Layer Shirt", "Chic Shift Dress", "Cloud Soft Joggers",
    "Neon Edge Tee", "Everyday Hoodie", "Mini Motion Tee", "Graffiti Splash Set",
    "Playground Pro Set", "Metro Chic Top", "Luxe Stretch Shirt", "Slouchy Fit Tee"
]

# Sample descriptions
DESCRIPTIONS = [
    "Durable and stylish", "Soft, breathable fabric", "Designed for all-day comfort",
    "Modern cut, classic feel", "Premium stitching and fit", "Minimalist design",
    "Great for casual or sport", "Effortless everyday wear", "Street-ready vibes",
    "Timeless look with comfort"
]

# Sample brands
BRANDS = ["Nike", "Adidas", "Under Armour", "Puma", "Uniqlo", "Champion", "Levi's", "H&M", "Zara"]

# Generate products
products = []

for i in range(1, 201):
    product = {
        "id": i,
        "name": random.choice(PRODUCT_NAMES),
        "description": random.choice(DESCRIPTIONS),
        "brand": random.choice(BRANDS),
        "price": round(random.uniform(399.0, 7999.0), 2),
        "category_id": random.choice(CATEGORY_IDS),
        "image_url": random.choice(UNSPLASH_IMAGES)
    }
    products.append(product)

# Save to JSON file
with open("products.json", "w") as f:
    json.dump(products, f, indent=4)

print("✅ 200 products generated without any external libraries and saved to 'products.json'")
