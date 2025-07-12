from fastapi import FastAPI
import uvicorn
from core.routers import auth, product_category, product, product_variant, address, payment, order

from starlette.middleware.cors import CORSMiddleware


description = """
Welcome to the ShopKart E-commerce API! 🚀

This API provides a comprehensive set of functionalities for managing your e-commerce platform.

Key features include:

- **Crud**
	- Create, Read, Update, and Delete endpoints.
- **Search**
	- Find specific information with parameters and pagination.
- **Auth**
	- Verify user/system identity.
	- Secure with Access and Refresh tokens.
- **Permission**
	- Assign roles with specific permissions.
	- Different access levels for User/Admin.
- **Validation**
	- Ensure accurate and secure input data.

"""


app = FastAPI(
    description=description,
    title="E-commerce API",
    version="1.0.0",
    swagger_ui_parameters={
        "syntaxHighlight.theme": "monokai",
        "layout": "BaseLayout",
        "filter": True,
        "tryItOutEnabled": True,
        "onComplete": "Ok"
    },
)

# Allowed frontend origins (React dev server, etc.)
origins = [
    "http://localhost:3000",
    # add more domains here if needed (like for production)
]

# Apply CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],                # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],                # Allow all headers (including Authorization)
)

app.include_router(auth.router, prefix="/api")
app.include_router(product_category.router, prefix="/api")
app.include_router(product.router, prefix="/api")
app.include_router(product_variant.router, prefix="/api")
app.include_router(address.router, prefix="/api")
app.include_router(payment.router, prefix="/api")
app.include_router(order.router, prefix="/api")




if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
