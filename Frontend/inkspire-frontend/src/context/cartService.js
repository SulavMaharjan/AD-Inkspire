const API_BASE_URL = "https://localhost:7039/api";

//get user's cart
export const getCart = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`${API_BASE_URL}/Cart`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication required");
      }

      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const cartData = await response.json();
    return cartData;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

//add to cart
export const addToCart = async (bookId, quantity = 1) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`${API_BASE_URL}/cart/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        bookId,
        quantity,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication required");
      }

      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message ||
          `API error: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

//update cart item
export const updateCartItem = async (cartItemId, quantity) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`${API_BASE_URL}/cart/items`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        cartItemId,
        quantity,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication required");
      }

      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};

//remove from the cart
export const removeFromCart = async (cartItemId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`${API_BASE_URL}/cart/items/${cartItemId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication required");
      }

      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
};

//clear cart
export const clearCart = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication required");
      }

      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};
