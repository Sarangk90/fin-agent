from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    """User model for future multi-user support."""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    assets = relationship("Asset", back_populates="user", cascade="all, delete-orphan")
    liabilities = relationship("Liability", back_populates="user", cascade="all, delete-orphan")
    expenses = relationship("Expense", back_populates="user", cascade="all, delete-orphan")
    goals = relationship("Goal", back_populates="user", cascade="all, delete-orphan")

class Asset(Base):
    """Asset database model."""
    __tablename__ = "assets"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    value_inr = Column(Float, nullable=False)
    asset_class = Column(String(100), nullable=False)
    asset_type = Column(String(100), nullable=False)
    fp_asset_class = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="assets")

class Liability(Base):
    """Liability database model."""
    __tablename__ = "liabilities"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    type = Column(String(100), nullable=False)
    outstanding_amount_inr = Column(Float, nullable=False)
    interest_rate = Column(Float, nullable=True)
    due_date = Column(Date, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="liabilities")

class Expense(Base):
    """Expense database model."""
    __tablename__ = "expenses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category = Column(String(100), nullable=False)
    details = Column(Text, nullable=True)
    amount = Column(Float, nullable=False)
    frequency = Column(String(50), nullable=False)
    need_want = Column(String(10), nullable=False)
    date = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="expenses")

class Goal(Base):
    """Goal database model."""
    __tablename__ = "goals"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, nullable=False, default=0.0)
    target_date = Column(Date, nullable=False)
    priority = Column(String(20), nullable=False)
    category = Column(String(100), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="goals")
