using backend_inkspire.DTOs;
using backend_inkspire.Repositories;
using backend_inkspire.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend_inkspire.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly IBookService _bookService;

        public BooksController(IBookService bookService)
        {
            _bookService = bookService;
        }

        // GET: api/books
        [HttpGet("getbooks")]
        public async Task<ActionResult<PaginatedResponseDTO<BookResponseDTO>>> GetBooks([FromQuery] BookFilterDTO filter)
        {
            var books = await _bookService.GetBooksAsync(filter);
            return Ok(books);
        }

        // GET: api/books/id
        [HttpGet("{id}")]
        public async Task<ActionResult<BookResponseDTO>> GetBook(int id)
        {
            var book = await _bookService.GetBookByIdAsync(id);
            if (book == null)
            {
                return NotFound();
            }
            return Ok(book);
        }

        // POST: api/books
        [HttpPost("addBooks")]
        [Authorize(Roles = "SuperAdmin,Staff")]
        public async Task<ActionResult<BookResponseDTO>> PostBook([FromForm] BookDTO bookDto)
        {
            try
            {
                var book = await _bookService.AddBookAsync(bookDto);
                return CreatedAtAction(nameof(GetBook), new { id = book.Id }, book);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "SuperAdmin,Staff")]
        public async Task<IActionResult> PutBook(int id, [FromForm] BookDTO bookDto)
        {
            try
            {
                var book = await _bookService.UpdateBookAsync(id, bookDto);
                if (book == null)
                {
                    return NotFound();
                }
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        // DELETE: api/books/id
        [HttpDelete("{id}")]
        [Authorize(Roles = "SuperAdmin,Staff")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var result = await _bookService.DeleteBookAsync(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }

        // POST: api/books/id/discount
        [HttpPost("{id}/discount")]
        [Authorize(Roles = "SuperAdmin,Staff")]
        public async Task<IActionResult> AddDiscount(int id, BookDiscountDTO discountDto)
        {
            try
            {
                var result = await _bookService.AddBookDiscountAsync(id, discountDto);
                if (!result)
                {
                    return NotFound();
                }
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/books/id/discount
        [HttpDelete("{id}/discount")]
        [Authorize(Roles = "SuperAdmin,Staff")]
        public async Task<IActionResult> RemoveDiscount(int id)
        {
            var result = await _bookService.RemoveBookDiscountAsync(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }

        // GET: api/books/bestsellers
        [HttpGet("bestsellers")]
        public async Task<ActionResult<PaginatedResponseDTO<BookResponseDTO>>> GetBestsellers(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var filter = new BookFilterDTO
            {
                SortBy = SortOption.Popularity,
                SortAscending = false,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
            return await GetBooks(filter);
        }

        // GET: api/books/awardwinners
        [HttpGet("awardwinners")]
        public async Task<ActionResult<PaginatedResponseDTO<BookResponseDTO>>> GetAwardWinners(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var filter = new BookFilterDTO
            {
                AwardWinner = true,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
            return await GetBooks(filter);
        }

        // GET: api/books/newreleases
        [HttpGet("newreleases")]
        public async Task<ActionResult<PaginatedResponseDTO<BookResponseDTO>>> GetNewReleases(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var filter = new BookFilterDTO
            {
                NewRelease = true,
                SortBy = SortOption.PublicationDateNewest,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
            return await GetBooks(filter);
        }

        // GET: api/books/newarrivals
        [HttpGet("newarrivals")]
        public async Task<ActionResult<PaginatedResponseDTO<BookResponseDTO>>> GetNewArrivals(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var filter = new BookFilterDTO
            {
                NewArrival = true,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
            return await GetBooks(filter);
        }

        // GET: api/books/comingsoon
        [HttpGet("comingsoon")]
        public async Task<ActionResult<PaginatedResponseDTO<BookResponseDTO>>> GetComingSoon(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var filter = new BookFilterDTO
            {
                ComingSoon = true,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
            return await GetBooks(filter);
        }

        // GET: api/books/onsale
        [HttpGet("onsale")]
        public async Task<ActionResult<PaginatedResponseDTO<BookResponseDTO>>> GetOnSale(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var filter = new BookFilterDTO
            {
                OnSale = true,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
            return await GetBooks(filter);
        }

        // GET: api/books/search/isbn/{isbn}
        [HttpGet("search/isbn/{isbn}")]
        public async Task<ActionResult<BookResponseDTO>> GetBookByIsbn(string isbn)
        {
            var filter = new BookFilterDTO { SearchTerm = isbn };
            var books = await _bookService.GetBooksAsync(filter);

            if (books?.Items == null || !books.Items.Any())
            {
                return NotFound();
            }

            return Ok(books.Items.First());
        }

        // GET: api/books/search/author/{author}
        [HttpGet("search/author/{author}")]
        public async Task<ActionResult<PaginatedResponseDTO<BookResponseDTO>>> GetBooksByAuthor(
            string author,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var filter = new BookFilterDTO
            {
                Author = author,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
            return await GetBooks(filter);
        }

        // GET: api/books/search/genre/{genre}
        [HttpGet("search/genre/{genre}")]
        public async Task<ActionResult<PaginatedResponseDTO<BookResponseDTO>>> GetBooksByGenre(
            string genre,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var filter = new BookFilterDTO
            {
                Genre = genre,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
            return await GetBooks(filter);
        }

        // GET: api/books/toprated
        [HttpGet("toprated")]
        public async Task<ActionResult<PaginatedResponseDTO<BookResponseDTO>>> GetTopRated(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var filter = new BookFilterDTO
            {
                SortBy = SortOption.Rating,
                SortAscending = false,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
            return await GetBooks(filter);
        }

        // GET: api/books/mostpopular
        [HttpGet("mostpopular")]
        public async Task<ActionResult<PaginatedResponseDTO<BookResponseDTO>>> GetMostPopular(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var filter = new BookFilterDTO
            {
                SortBy = SortOption.Popularity,
                SortAscending = false,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
            return await GetBooks(filter);
        }

        [HttpGet("genres")]
        public async Task<ActionResult<IEnumerable<string>>> GetGenres()
        {
            var genres = await _bookService.GetDistinctGenresAsync();
            return Ok(genres);
        }

        [HttpGet("authors")]
        public async Task<ActionResult<IEnumerable<string>>> GetAuthors()
        {
            var authors = await _bookService.GetDistinctAuthorsAsync();
            return Ok(authors);
        }

        [HttpGet("publishers")]
        public async Task<ActionResult<IEnumerable<string>>> GetPublishers()
        {
            var publishers = await _bookService.GetDistinctPublishersAsync();
            return Ok(publishers);
        }

        [HttpGet("languages")]
        public async Task<ActionResult<IEnumerable<string>>> GetLanguages()
        {
            var languages = await _bookService.GetDistinctLanguagesAsync();
            return Ok(languages);
        }

        [HttpGet("formats")]
        public async Task<ActionResult<IEnumerable<string>>> GetFormats()
        {
            var formats = await _bookService.GetDistinctFormatsAsync();
            return Ok(formats);
        }

        [HttpGet("price-low-to-high")]
        public async Task<ActionResult<PaginatedResponseDTO<BookResponseDTO>>> GetBooksSortedByPriceLowToHigh(
            [FromQuery] BookFilterDTO filter)
        {
            try
            {
                filter ??= new BookFilterDTO();
                filter.SortBy = SortOption.PriceLow;
                filter.SortAscending = true;

                var books = await _bookService.GetBooksAsync(filter);
                return Ok(books);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving books: {ex.Message}");
            }
        }

        [HttpGet("price-high-to-low")]
        public async Task<ActionResult<PaginatedResponseDTO<BookResponseDTO>>> GetBooksSortedByPriceHighToLow(
            [FromQuery] BookFilterDTO filter)
        {
            try
            {
                filter ??= new BookFilterDTO();
                filter.SortBy = SortOption.PriceHigh;
                filter.SortAscending = false;

                var books = await _bookService.GetBooksAsync(filter);
                return Ok(books);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving books: {ex.Message}");
            }
        }

        // GET: api/books/price-range
        [HttpGet("price-range")]
        public async Task<ActionResult<PaginatedResponseDTO<BookResponseDTO>>> GetBooksByPriceRange(
            [FromQuery] decimal minPrice = 0,
            [FromQuery] decimal maxPrice = 1000,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var filter = new BookFilterDTO
            {
                MinPrice = minPrice,
                MaxPrice = maxPrice,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
            return await GetBooks(filter);
        }
    }
}