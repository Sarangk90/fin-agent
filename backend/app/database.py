from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from .config import get_settings

settings = get_settings()

# Create async engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DATABASE_ECHO,
    future=True
)

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

class Base(DeclarativeBase):
    """Base class for all database models."""
    pass

async def get_db_session():
    """Dependency to get database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

async def create_tables():
    """Create all database tables."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def drop_tables():
    """Drop all database tables."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
