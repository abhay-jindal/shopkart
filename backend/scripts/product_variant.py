import random
import json

# Sizes and colors
sizes = ["S", "M", "L", "XL", "XXL"]
colors = ["Black", "White", "Blue", "Red", "Green", "Gray"]

# Simulate 100 base products (IDs from 1 to 100)
variants = []
variant_id = 1

for product_id in range(1, 101):
    used_combos = set()
    for _ in range(random.randint(2, 4)):  # 2 to 5 variants per product
        while True:
            size = random.choice(sizes)
            color = random.choice(colors)
            combo = (size, color)
            if combo not in used_combos:
                used_combos.add(combo)
                break

        variant = {
            "id": variant_id,
            "product_id": product_id,
            "sku": f"SKU-{product_id:03d}-{size[0]}{color[0]}",
            "size": size,
            "color": color,
            "stock": random.randint(10, 100),
            "price": round(random.uniform(19.99, 149.99), 2)
        }
        variants.append(variant)
        variant_id += 1

# Save to JSON file
with open("product_variants.json", "w") as f:
    json.dump(variants, f, indent=2)

print("✅ product_variants.json file generated.")
