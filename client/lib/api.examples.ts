/**
 * EXAMPLE: How to use the apiCall wrapper for authenticated requests
 * 
 * This file demonstrates how to make API calls that automatically include
 * the JWT token in the Authorization header.
 */

import { apiCall, setToken, getToken, clearToken, isAuthenticated } from "@/lib/api";

// ============================================
// EXAMPLE 1: Login and store token
// ============================================
export async function exampleLogin() {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      email: "user@example.com", 
      password: "password123" 
    }),
  });

  const data = await response.json();

  if (data.success && data.token) {
    setToken(data.token); // Store token for future requests
    console.log("Token saved:", data.token);
  }
}

// ============================================
// EXAMPLE 2: Get user profile (requires token)
// ============================================
export async function exampleGetUserProfile() {
  try {
    const response = await apiCall("/api/users/profile", {
      method: "GET",
    });

    const data = await response.json();

    if (data.success) {
      console.log("User profile:", data.user);
      return data.user;
    }
  } catch (error) {
    console.error("Failed to fetch profile:", error);
  }
}

// ============================================
// EXAMPLE 3: Create a new post (requires token)
// ============================================
export async function exampleCreatePost(title: string, content: string) {
  try {
    const response = await apiCall("/api/posts", {
      method: "POST",
      body: JSON.stringify({ title, content }),
    });

    const data = await response.json();

    if (data.success) {
      console.log("Post created:", data.post);
      return data.post;
    }
  } catch (error) {
    console.error("Failed to create post:", error);
  }
}

// ============================================
// EXAMPLE 4: Update user data (requires token)
// ============================================
export async function exampleUpdateUser(updates: Record<string, any>) {
  try {
    const response = await apiCall("/api/users/profile", {
      method: "PUT",
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (data.success) {
      console.log("User updated:", data.user);
      return data.user;
    }
  } catch (error) {
    console.error("Failed to update user:", error);
  }
}

// ============================================
// EXAMPLE 5: Delete a post (requires token)
// ============================================
export async function exampleDeletePost(postId: string) {
  try {
    const response = await apiCall(`/api/posts/${postId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (data.success) {
      console.log("Post deleted");
      return true;
    }
  } catch (error) {
    console.error("Failed to delete post:", error);
  }
}

// ============================================
// EXAMPLE 6: Logout and clear token
// ============================================
export function exampleLogout() {
  clearToken();
  console.log("Logged out - token cleared");
  // Optionally redirect to login page
}

// ============================================
// EXAMPLE 7: Check if user is logged in
// ============================================
export function exampleCheckAuth() {
  if (isAuthenticated()) {
    console.log("User is logged in");
    const token = getToken();
    console.log("Current token:", token);
  } else {
    console.log("User is not logged in");
  }
}

// ============================================
// REACT COMPONENT EXAMPLE
// ============================================
/**
 * This is how you would use these functions in a React component
 */
/*
"use client";
import { useEffect, useState } from "react";
import { apiCall, isAuthenticated } from "@/lib/api";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      // Redirect to login if not authenticated
      window.location.href = "/auth";
      return;
    }

    // Fetch user profile with token automatically added to headers
    apiCall("/api/users/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user data</div>;

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}
*/
