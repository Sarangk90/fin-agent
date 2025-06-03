from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers
from app.api.assets_router import router as assets_api_router
from app.api.expenses_router import router as expenses_api_router
from app.api.liabilities_router import router as liabilities_api_router
from app.api.fi_router import router as fi_api_router

# Import configuration
from app.config import get_settings

settings = get_settings()

app = FastAPI(
    title=settings.API_TITLE,
    description=settings.API_DESCRIPTION,
    version=settings.API_VERSION
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include API routers
app.include_router(assets_api_router)
app.include_router(expenses_api_router)
app.include_router(liabilities_api_router)
app.include_router(fi_api_router)

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
