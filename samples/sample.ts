/**
 * Sample TypeScript file for theme preview
 * Demonstrates syntax highlighting across different constructs
 */

import { EventEmitter } from 'events';

// Constants & Configuration
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRIES = 3;
const TIMEOUT_MS = 5000;

// Type definitions
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  metadata?: Record<string, unknown>;
}

type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

// Enum
enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
}

// Generic class with decorator pattern
abstract class BaseService<T> {
  protected readonly endpoint: string;
  
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }
  
  abstract fetchById(id: number): Promise<T | null>;
}

// Decorator (conceptual - requires experimental decorators)
function logged(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = async function (...args: any[]) {
    console.log(`Calling ${key} with args:`, args);
    const result = await original.apply(this, args);
    console.log(`${key} returned:`, result);
    return result;
  };
  return descriptor;
}

// Main service class
class UserService extends BaseService<User> {
  private cache = new Map<number, User>();
  private emitter = new EventEmitter();
  
  constructor() {
    super('/users');
  }
  
  // Async method with error handling
  async fetchById(id: number): Promise<User | null> {
    // Check cache first
    if (this.cache.has(id)) {
      return this.cache.get(id)!;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}${this.endpoint}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data: ApiResponse<User> = await response.json();
      this.cache.set(id, data.data);
      this.emitter.emit('user:fetched', data.data);
      
      return data.data;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      return null;
    }
  }
  
  // Arrow function property
  private getToken = (): string => {
    return localStorage.getItem('auth_token') ?? '';
  };
  
  // Static utility method
  static validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  
  // Method with complex types
  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    const { name, email, role } = userData;
    
    if (!UserService.validateEmail(email)) {
      throw new Error('Invalid email format');
    }
    
    // Template literal
    const payload = JSON.stringify({
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
    });
    
    const response = await fetch(`${API_BASE_URL}${this.endpoint}`, {
      method: 'POST',
      body: payload,
    });
    
    return response.json();
  }
}

// Utility functions
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Array methods and modern syntax
const users: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'guest' },
];

const adminUsers = users
  .filter((user) => user.role === 'admin')
  .map(({ id, name }) => ({ id, name }));

// Destructuring and spread
const [firstUser, ...otherUsers] = users;
const updatedUser: User = { ...firstUser, name: 'Alice Updated' };

// Nullish coalescing and optional chaining
const userName = updatedUser?.metadata?.displayName ?? updatedUser.name;

// Export
export { UserService, type User, HttpStatus };
export default UserService;
