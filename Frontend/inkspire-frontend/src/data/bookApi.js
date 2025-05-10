// Simulated API call for bookmarked books
export const getBookmarkedBooks = () => {
  // In a real app, this would fetch from an actual API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          title: "Pride and Prejudice",
          author: "Jane Austen",
          coverImage: "https://images.pexels.com/photos/1927421/pexels-photo-1927421.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          price: 15.99,
          originalPrice: 15.99,
          discountPercentage: 0,
          genre: "Classic Literature",
          format: "paperback",
          inStock: true,
          inLibrary: true,
          dateAdded: "2023-04-15T14:22:56Z"
        },
        {
          id: 2,
          title: "The Midnight Library",
          author: "Matt Haig",
          coverImage: "https://images.pexels.com/photos/3747486/pexels-photo-3747486.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          price: 17.99,
          originalPrice: 24.99,
          discountPercentage: 28,
          genre: "Contemporary Fiction",
          format: "hardcover",
          inStock: true,
          inLibrary: false,
          dateAdded: "2023-05-02T09:15:23Z"
        },
        {
          id: 3,
          title: "Dune",
          author: "Frank Herbert",
          coverImage: "https://images.pexels.com/photos/3394648/pexels-photo-3394648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          price: 19.99,
          originalPrice: 19.99,
          discountPercentage: 0,
          genre: "Science Fiction",
          format: "limited",
          inStock: false,
          inLibrary: true,
          dateAdded: "2023-05-12T16:44:09Z"
        },
        {
          id: 4,
          title: "The Song of Achilles",
          author: "Madeline Miller",
          coverImage: "https://images.pexels.com/photos/5858918/pexels-photo-5858918.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          price: 12.99,
          originalPrice: 16.99,
          discountPercentage: 23,
          genre: "Historical Fiction",
          format: "paperback",
          inStock: true,
          inLibrary: true,
          dateAdded: "2023-05-18T12:30:45Z"
        },
        {
          id: 5,
          title: "Atomic Habits",
          author: "James Clear",
          coverImage: "https://images.pexels.com/photos/3747455/pexels-photo-3747455.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          price: 22.99,
          originalPrice: 22.99,
          discountPercentage: 0,
          genre: "Self-Help",
          format: "hardcover",
          inStock: true,
          inLibrary: false,
          dateAdded: "2023-06-01T08:12:32Z"
        },
        {
          id: 6,
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          coverImage: "https://images.pexels.com/photos/3747508/pexels-photo-3747508.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          price: 12.99,
          originalPrice: 12.99,
          discountPercentage: 0,
          genre: "Classic Literature",
          format: "signed",
          inStock: false,
          inLibrary: true,
          dateAdded: "2023-06-05T14:09:17Z"
        },
        {
          id: 7,
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          coverImage: "https://images.pexels.com/photos/3747507/pexels-photo-3747507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          price: 14.99,
          originalPrice: 14.99,
          discountPercentage: 0,
          genre: "Classic Literature",
          format: "paperback",
          inStock: true,
          inLibrary: true,
          dateAdded: "2023-06-10T11:45:03Z"
        },
        {
          id: 8,
          title: "Project Hail Mary",
          author: "Andy Weir",
          coverImage: "https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          price: 19.99,
          originalPrice: 27.99,
          discountPercentage: 29,
          genre: "Science Fiction",
          format: "hardcover",
          inStock: true,
          inLibrary: false,
          dateAdded: "2023-06-18T16:22:41Z"
        }
      ]);
    }, 1000);
  });
};