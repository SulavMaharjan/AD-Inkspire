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
      priceMin,
      priceMax,
      genre,
      author,
      minRating,
      format,
      language,
      publisher,
      ...otherFilters
    } = filters;

    const queryParams = new URLSearchParams();
    queryParams.append("pageNumber", pageNumber);
    queryParams.append("pageSize", pageSize);

    // Normalize sortBy to match API expectations
    const apiSortMapping = {
      title: "Title",
      "publication-date-newest": "PublicationDateNewest",
      "publication-date-oldest": "PublicationDateOldest",
      "price-low": "PriceLow",
      "price-high": "PriceHigh",
      rating: "Rating",
      popularity: "Popularity",
    };

    const apiSortBy = apiSortMapping[sortBy] || "Popularity";

    // Determine sort ascending based on sort option
    let finalSortAscending = sortAscending;
    if (sortBy === "title") finalSortAscending = true;
    if (sortBy === "price-low") finalSortAscending = true;
    if (sortBy === "price-high") finalSortAscending = false;

    queryParams.append("sortBy", apiSortBy);
    queryParams.append("sortAscending", finalSortAscending);

    // Add optional filters
    if (searchTerm) queryParams.append("searchTerm", searchTerm);
    if (priceMin !== undefined && priceMin > 0)
      queryParams.append("priceMin", priceMin);
    if (priceMax !== undefined && priceMax < 1000)
      queryParams.append("priceMax", priceMax);
    if (genre) queryParams.append("genre", genre);
    if (author) queryParams.append("author", author);
    if (minRating) queryParams.append("minRating", minRating);
    if (format) queryParams.append("format", format);
    if (language) queryParams.append("language", language);
    if (publisher) queryParams.append("publisher", publisher);

    // Add any additional filters
    Object.entries(otherFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        queryParams.append(key, value);
      }
    });

    const url = `${API_BASE_URL}/books/getbooks?${queryParams}`;
    console.log("Fetching books with URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Book API response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

//books on sale
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

//bestsellers
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

//new releases
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

//award winners
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

//new arrivals
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

//coming soon books
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

//book by ID
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

//books by genre
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

//books by author
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

//distinct genres
export const fetchGenres = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/books/genres`, {
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
    console.error("Error fetching genres:", error);
    throw error;
  }
};

//distinct authors
export const fetchAuthors = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/books/authors`, {
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
    console.error("Error fetching authors:", error);
    throw error;
  }
};

//distinct publishers
export const fetchPublishers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/books/publishers`, {
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
    console.error("Error fetching publishers:", error);
    throw error;
  }
};

//distinct languages
export const fetchLanguages = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/books/languages`, {
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
    console.error("Error fetching languages:", error);
    throw error;
  }
};

//distinct formats
export const fetchFormats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/books/formats`, {
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
    console.error("Error fetching formats:", error);
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

export const fetchTopRated = async (pageNumber = 1, pageSize = 12) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/books/toprated?pageNumber=${pageNumber}&pageSize=${pageSize}`,
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
    console.error("Error fetching top-rated books:", error);
    throw error;
  }
};

export const fetchMostPopular = async (pageNumber = 1, pageSize = 12) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/books/mostpopular?pageNumber=${pageNumber}&pageSize=${pageSize}`,
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
    console.error("Error fetching most popular books:", error);
    throw error;
  }
};

//price low to high books
export const fetchBooksLowToHigh = async (
  pageNumber = 1,
  pageSize = 12,
  additionalFilters = {}
) => {
  try {
    const queryParams = new URLSearchParams({
      pageNumber: pageNumber,
      pageSize: pageSize,
      ...Object.fromEntries(
        Object.entries(additionalFilters).filter(([_, v]) => v != null)
      ),
    });

    const response = await fetch(
      `${API_BASE_URL}/books/price-low-to-high?${queryParams}`,
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
    console.error("Error fetching books sorted by price (low to high):", error);
    throw error;
  }
};

//price high to low books
export const fetchBooksHighToLow = async (
  pageNumber = 1,
  pageSize = 12,
  additionalFilters = {}
) => {
  try {
    const queryParams = new URLSearchParams({
      pageNumber: pageNumber,
      pageSize: pageSize,
      ...Object.fromEntries(
        Object.entries(additionalFilters).filter(([_, v]) => v != null)
      ),
    });

    const response = await fetch(
      `${API_BASE_URL}/books/price-high-to-low?${queryParams}`,
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
    console.error("Error fetching books sorted by price (high to low):", error);
    throw error;
  }
};
