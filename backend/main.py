from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import the new assets router
from app.api.assets_router import router as assets_api_router
from app.api.expenses_router import router as expenses_api_router # Import expenses router
from app.api.liabilities_router import router as liabilities_api_router # Import liabilities router
# from app.db.database import engine # For later when we have DB models
# from app.models import asset_models # If your ORM models are also Pydantic

# If you have base SQLAlchemy models to create:
# asset_models.Base.metadata.create_all(bind=engine) # Example

app = FastAPI(
    title="Financial Agent API",
    description="API for managing personal finance data.",
    version="0.1.0"
)

# CORS configuration
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173", # Your frontend dev port
    # Add any other origins your frontend might be served from
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include the assets API router
app.include_router(assets_api_router)
app.include_router(expenses_api_router) # Include expenses router
app.include_router(liabilities_api_router) # Include liabilities router

# You can add other routers here as your application grows
# For example, for liabilities, expenses, etc.
# from app.api.liabilities_router import router as liabilities_api_router
# app.include_router(liabilities_api_router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Financial Agent API! Visit /docs for API documentation."}

# To run this app: uvicorn backend.main:app --reload --port 5001
# (The if __name__ block can also be used, but uvicorn command is standard for dev)
if __name__ == "__main__":
    import uvicorn
    # It's better to run with `uvicorn backend.main:app --reload` for development
    # The main:app string refers to the module and the app instance
    uvicorn.run("main:app", host="0.0.0.0", port=5001, reload=True) 