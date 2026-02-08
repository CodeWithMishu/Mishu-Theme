"""
Sample Python file for theme preview
Demonstrates syntax highlighting across different constructs
"""

from __future__ import annotations

import asyncio
import json
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum, auto
from functools import wraps
from typing import Any, Callable, Generic, TypeVar, Optional

# Constants
API_BASE_URL = "https://api.example.com"
MAX_RETRIES = 3
TIMEOUT_SECONDS = 5.0

# Type variables
T = TypeVar("T")
R = TypeVar("R")


# Enum definition
class HttpStatus(Enum):
    """HTTP status codes."""
    OK = 200
    CREATED = 201
    BAD_REQUEST = 400
    UNAUTHORIZED = 401
    NOT_FOUND = 404


class UserRole(Enum):
    ADMIN = auto()
    USER = auto()
    GUEST = auto()


# Dataclass
@dataclass
class User:
    """Represents a user in the system."""
    id: int
    name: str
    email: str
    role: UserRole = UserRole.USER
    metadata: dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.now)
    
    def __post_init__(self) -> None:
        """Validate user data after initialization."""
        if not self._is_valid_email(self.email):
            raise ValueError(f"Invalid email: {self.email}")
    
    @staticmethod
    def _is_valid_email(email: str) -> bool:
        """Check if email format is valid."""
        import re
        pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        return bool(re.match(pattern, email))
    
    def to_dict(self) -> dict[str, Any]:
        """Convert user to dictionary."""
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role.name,
            "created_at": self.created_at.isoformat(),
        }


# Decorator
def logged(func: Callable[..., R]) -> Callable[..., R]:
    """Decorator that logs function calls."""
    @wraps(func)
    async def wrapper(*args: Any, **kwargs: Any) -> R:
        print(f"Calling {func.__name__} with args={args}, kwargs={kwargs}")
        try:
            result = await func(*args, **kwargs)
            print(f"{func.__name__} returned: {result}")
            return result
        except Exception as e:
            print(f"{func.__name__} raised: {e}")
            raise
    return wrapper


# Abstract base class
class BaseService(ABC, Generic[T]):
    """Abstract base class for API services."""
    
    def __init__(self, endpoint: str) -> None:
        self.endpoint = endpoint
        self._cache: dict[int, T] = {}
    
    @abstractmethod
    async def fetch_by_id(self, id: int) -> Optional[T]:
        """Fetch an item by its ID."""
        ...
    
    def _get_cache(self, id: int) -> Optional[T]:
        """Get item from cache."""
        return self._cache.get(id)
    
    def _set_cache(self, id: int, item: T) -> None:
        """Store item in cache."""
        self._cache[id] = item


# Concrete implementation
class UserService(BaseService[User]):
    """Service for managing users."""
    
    def __init__(self) -> None:
        super().__init__("/users")
        self._session = None
    
    @logged
    async def fetch_by_id(self, id: int) -> Optional[User]:
        """Fetch a user by their ID."""
        # Check cache first
        if cached := self._get_cache(id):
            return cached
        
        try:
            # Simulate API call
            async with asyncio.timeout(TIMEOUT_SECONDS):
                # In real code, this would be an HTTP request
                await asyncio.sleep(0.1)  # Simulated delay
                
                # Mock response
                user = User(
                    id=id,
                    name=f"User {id}",
                    email=f"user{id}@example.com",
                    role=UserRole.USER,
                )
                
                self._set_cache(id, user)
                return user
                
        except asyncio.TimeoutError:
            print(f"Timeout fetching user {id}")
            return None
        except Exception as e:
            print(f"Error fetching user {id}: {e}")
            return None
    
    async def create_user(
        self,
        name: str,
        email: str,
        role: UserRole = UserRole.USER,
    ) -> User:
        """Create a new user."""
        # Generate ID (in real app, this comes from database)
        new_id = len(self._cache) + 1
        
        user = User(
            id=new_id,
            name=name,
            email=email,
            role=role,
        )
        
        self._set_cache(new_id, user)
        return user
    
    def get_users_by_role(self, role: UserRole) -> list[User]:
        """Get all cached users with a specific role."""
        return [
            user for user in self._cache.values()
            if user.role == role
        ]


# Utility functions
def debounce(delay: float) -> Callable[[Callable[..., R]], Callable[..., R]]:
    """Debounce decorator factory."""
    def decorator(func: Callable[..., R]) -> Callable[..., R]:
        last_call: float = 0
        
        @wraps(func)
        def wrapper(*args: Any, **kwargs: Any) -> R:
            nonlocal last_call
            import time
            current_time = time.time()
            
            if current_time - last_call >= delay:
                last_call = current_time
                return func(*args, **kwargs)
            
            # Return cached result or None
            return None  # type: ignore
        
        return wrapper
    return decorator


# Context manager
class DatabaseConnection:
    """Context manager for database connections."""
    
    def __init__(self, connection_string: str) -> None:
        self.connection_string = connection_string
        self._connection = None
    
    async def __aenter__(self) -> "DatabaseConnection":
        """Enter async context."""
        print(f"Connecting to {self.connection_string}")
        await asyncio.sleep(0.1)  # Simulated connection
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb) -> bool:
        """Exit async context."""
        print("Closing database connection")
        return False  # Don't suppress exceptions


# Main execution
async def main() -> None:
    """Main entry point."""
    service = UserService()
    
    # Create some users
    users = [
        await service.create_user("Alice", "alice@example.com", UserRole.ADMIN),
        await service.create_user("Bob", "bob@example.com"),
        await service.create_user("Charlie", "charlie@example.com", UserRole.GUEST),
    ]
    
    # Fetch a user
    user = await service.fetch_by_id(1)
    if user:
        print(f"Fetched: {user.to_dict()}")
    
    # List comprehension with conditional
    admin_names = [u.name for u in users if u.role == UserRole.ADMIN]
    print(f"Admins: {admin_names}")
    
    # Dictionary comprehension
    user_map = {u.id: u.name for u in users}
    print(f"User map: {user_map}")
    
    # f-string with expression
    total = len(users)
    print(f"Total users: {total} ({'many' if total > 2 else 'few'})")


if __name__ == "__main__":
    asyncio.run(main())
