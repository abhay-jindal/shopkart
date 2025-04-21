import random
import json

# Assuming you already have products loaded from the products.json
with open("./products.json") as f:
    products = json.load(f)

SIZES = ["XS", "S", "M", "L", "XL"]
COLORS = ["Black", "White", "Navy", "Olive", "Grey", "Beige", "Maroon"]

variants = []
variant_id = 1

for product in products:
    num_variants = random.randint(2, 5)  # Each product will have 2–5 variants
    used_combinations = set()

    for _ in range(num_variants):
        # Ensure unique size-color combination per product
        while True:
            size = random.choice(SIZES)
            color = random.choice(COLORS)
            key = (size, color)
            if key not in used_combinations:
                used_combinations.add(key)
                break

        variant = {
            "id": variant_id,
            "product_id": product["id"],
            "sku": f"{product['name'][:3].upper()}-{variant_id:04}",
            "size": size,
            "color": color,
            "stock": random.randint(0, 50),
            "price": round(product["price"] + random.uniform(-200.0, 200.0), 2)
        }
        variants.append(variant)
        variant_id += 1

# Save variants to JSON
with open("variants.json", "w") as f:
    json.dump(variants, f, indent=4)

print(f"✅ {len(variants)} product variants generated and saved to 'variants.json'")
