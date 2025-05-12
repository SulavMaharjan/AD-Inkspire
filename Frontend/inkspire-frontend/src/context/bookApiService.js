const API_BASE_URL = "https://localhost:7039/api";

export const checkApiAvailability = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/books/getbooks?pageNumber=1&pageSize=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(5000),
      }
    );

    return response.ok;
  } catch (error) {
    console.error("API availability check failed:", error);
    return false;
  }
};

//fetch books
export const fetchBooks = async (filters = {}) => {
  try {
    const {
      pageNumber = 1,
      pageSize = 12,
      searchTerm = "",
      sortBy = "Popularity",
      sortAscending = false,
      genre = "",
      author = "",
      priceMin,
      priceMax,
      ...otherFilters
    } = filters;

    const queryParams = new URLSearchParams();
    queryParams.append("pageNumber", pageNumber);
    queryParams.append("pageSize", pageSize);

    if (searchTerm) queryParams.append("searchTerm", searchTerm);
    if (sortBy) queryParams.append("sortBy", sortBy);
    queryParams.append("sortAscending", sortAscending);
    if (genre) queryParams.append("genre", genre);
    if (author) queryParams.append("author", author);
    if (priceMin !== undefined) queryParams.append("priceMin", priceMin);
    if (priceMax !== undefined) queryParams.append("priceMax", priceMax);

    Object.entries(otherFilters).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value);
      }
    });

    const response = await fetch(
      `${API_BASE_URL}/books/getbooks?${queryParams}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

//fetch books on sale
export const fetchOnSale = async (pageNumber = 1, pageSize = 12) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/books/onsale?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching on sale books:", error);
    throw error;
  }
};

//fetch bestsellers
export const fetchBestsellers = async (pageNumber = 1, pageSize = 12) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/books/bestsellers?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching bestsellers:", error);
    throw error;
  }
};

//fetch new releases
export const fetchNewReleases = async (pageNumber = 1, pageSize = 12) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/books/newreleases?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching new releases:", error);
    throw error;
  }
};

//fetch award winners
export const fetchAwardWinners = async (pageNumber = 1, pageSize = 12) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/books/awardwinners?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching award winners:", error);
    throw error;
  }
};

//fetch new arrivals
export const fetchNewArrivals = async (pageNumber = 1, pageSize = 12) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/books/newarrivals?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    throw error;
  }
};

//fetch coming soon books
export const fetchComingSoon = async (pageNumber = 1, pageSize = 12) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/books/comingsoon?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching coming soon books:", error);
    throw error;
  }
};

//fetch book by ID
export const fetchBookById = async (bookId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching book ID ${bookId}:`, error);
    throw error;
  }
};

//fetch books by genre
export const fetchBooksByGenre = async (
  genre,
  pageNumber = 1,
  pageSize = 12
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/books/search/genre/${encodeURIComponent(
        genre
      )}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching books by genre ${genre}:`, error);
    throw error;
  }
};

//fetch books by author
export const fetchBooksByAuthor = async (
  author,
  pageNumber = 1,
  pageSize = 12
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/books/search/author/${encodeURIComponent(
        author
      )}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching books by author ${author}:`, error);
    throw error;
  }
};

// Bookmark related functions
export const getBookmarkedBooks = async (pageNumber = 1, pageSize = 10) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/bookmarks?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching bookmarked books:", error);
    throw error;
  }
};

// Add bookmark
export const addBookmark = async (bookId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookmarks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ bookId }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding bookmark:", error);
    throw error;
  }
};

// Remove bookmark
export const removeBookmark = async (bookId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookmarks/${bookId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("Error removing bookmark:", error);
    throw error;
  }
};

// Check if book is bookmarked
export const checkBookmark = async (bookId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookmarks/check/${bookId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error checking bookmark:", error);
    throw error;
  }
};
