// Sample Rust file for theme preview
// Demonstrates syntax highlighting across different Rust constructs

use std::collections::HashMap;
use std::fmt::{self, Display};
use std::sync::{Arc, Mutex};

// Constants
const MAX_RETRIES: u32 = 3;
const API_BASE_URL: &str = "https://api.example.com";

// Type alias
type Result<T> = std::result::Result<T, AppError>;
type UserCache = Arc<Mutex<HashMap<u64, User>>>;

// Enum with variants
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum UserRole {
    Admin,
    User,
    Guest,
}

// Error enum
#[derive(Debug)]
pub enum AppError {
    NotFound(String),
    Unauthorized,
    NetworkError(String),
    ParseError { field: String, message: String },
}

impl Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            AppError::NotFound(msg) => write!(f, "Not found: {}", msg),
            AppError::Unauthorized => write!(f, "Unauthorized access"),
            AppError::NetworkError(msg) => write!(f, "Network error: {}", msg),
            AppError::ParseError { field, message } => {
                write!(f, "Parse error in {}: {}", field, message)
            }
        }
    }
}

impl std::error::Error for AppError {}

// Struct with derive macros
#[derive(Debug, Clone)]
pub struct User {
    pub id: u64,
    pub name: String,
    pub email: String,
    pub role: UserRole,
    metadata: Option<HashMap<String, String>>,
}

impl User {
    /// Create a new user with the given details
    pub fn new(id: u64, name: impl Into<String>, email: impl Into<String>) -> Self {
        Self {
            id,
            name: name.into(),
            email: email.into(),
            role: UserRole::User,
            metadata: None,
        }
    }

    /// Create an admin user
    pub fn admin(id: u64, name: impl Into<String>, email: impl Into<String>) -> Self {
        Self {
            role: UserRole::Admin,
            ..Self::new(id, name, email)
        }
    }

    /// Check if user is admin
    #[inline]
    pub fn is_admin(&self) -> bool {
        matches!(self.role, UserRole::Admin)
    }

    /// Add metadata to user
    pub fn with_metadata(mut self, key: impl Into<String>, value: impl Into<String>) -> Self {
        self.metadata
            .get_or_insert_with(HashMap::new)
            .insert(key.into(), value.into());
        self
    }
}

impl Display for User {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "User({}: {} <{}>)", self.id, self.name, self.email)
    }
}

// Trait definition
pub trait Repository<T> {
    fn find_by_id(&self, id: u64) -> Result<Option<T>>;
    fn save(&mut self, item: T) -> Result<()>;
    fn delete(&mut self, id: u64) -> Result<bool>;
}

// Generic struct
pub struct InMemoryRepository<T: Clone> {
    storage: HashMap<u64, T>,
    id_counter: u64,
}

impl<T: Clone> InMemoryRepository<T> {
    pub fn new() -> Self {
        Self {
            storage: HashMap::new(),
            id_counter: 0,
        }
    }

    pub fn len(&self) -> usize {
        self.storage.len()
    }

    pub fn is_empty(&self) -> bool {
        self.storage.is_empty()
    }
}

impl<T: Clone> Default for InMemoryRepository<T> {
    fn default() -> Self {
        Self::new()
    }
}

// Trait implementation
impl Repository<User> for InMemoryRepository<User> {
    fn find_by_id(&self, id: u64) -> Result<Option<User>> {
        Ok(self.storage.get(&id).cloned())
    }

    fn save(&mut self, item: User) -> Result<()> {
        self.storage.insert(item.id, item);
        Ok(())
    }

    fn delete(&mut self, id: u64) -> Result<bool> {
        Ok(self.storage.remove(&id).is_some())
    }
}

// Async function with lifetimes
pub async fn fetch_user<'a>(
    cache: &'a UserCache,
    id: u64,
) -> Result<Option<User>> {
    // Try cache first
    {
        let cache_guard = cache.lock().map_err(|_| {
            AppError::NetworkError("Cache lock poisoned".to_string())
        })?;
        
        if let Some(user) = cache_guard.get(&id) {
            return Ok(Some(user.clone()));
        }
    }

    // Simulate network fetch
    tokio::time::sleep(std::time::Duration::from_millis(100)).await;

    // Mock response
    let user = User::new(id, format!("User {}", id), format!("user{}@example.com", id));

    // Update cache
    {
        let mut cache_guard = cache.lock().map_err(|_| {
            AppError::NetworkError("Cache lock poisoned".to_string())
        })?;
        cache_guard.insert(id, user.clone());
    }

    Ok(Some(user))
}

// Macro usage
macro_rules! create_users {
    ($($id:expr => $name:expr),+ $(,)?) => {
        vec![
            $(
                User::new($id, $name, format!("{}@example.com", $name.to_lowercase()))
            ),+
        ]
    };
}

// Main function
#[tokio::main]
async fn main() -> Result<()> {
    // Create users using macro
    let users = create_users![
        1 => "Alice",
        2 => "Bob",
        3 => "Charlie",
    ];

    // Initialize repository
    let mut repo: InMemoryRepository<User> = InMemoryRepository::new();

    // Save users
    for user in users {
        println!("Saving: {}", user);
        repo.save(user)?;
    }

    // Query with pattern matching
    if let Some(user) = repo.find_by_id(1)? {
        println!("Found: {}", user);
        
        match user.role {
            UserRole::Admin => println!("  -> Has admin privileges"),
            UserRole::User => println!("  -> Regular user"),
            UserRole::Guest => println!("  -> Limited access"),
        }
    }

    // Iterator methods
    let admin_count = users
        .iter()
        .filter(|u| u.is_admin())
        .count();

    println!("Admin count: {}", admin_count);

    // Closure
    let format_user = |u: &User| -> String {
        format!("[{}] {} ({})", u.id, u.name, u.role as u8)
    };

    for user in &users {
        println!("{}", format_user(user));
    }

    // String formatting
    let message = format!(
        "Repository contains {} user{}",
        repo.len(),
        if repo.len() == 1 { "" } else { "s" }
    );
    println!("{}", message);

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_user_creation() {
        let user = User::new(1, "Test", "test@example.com");
        assert_eq!(user.id, 1);
        assert_eq!(user.name, "Test");
        assert_eq!(user.role, UserRole::User);
    }

    #[test]
    fn test_admin_user() {
        let admin = User::admin(1, "Admin", "admin@example.com");
        assert!(admin.is_admin());
    }

    #[test]
    fn test_repository() -> Result<()> {
        let mut repo = InMemoryRepository::new();
        let user = User::new(1, "Test", "test@example.com");
        
        repo.save(user.clone())?;
        
        let found = repo.find_by_id(1)?;
        assert!(found.is_some());
        assert_eq!(found.unwrap().name, "Test");
        
        Ok(())
    }
}
