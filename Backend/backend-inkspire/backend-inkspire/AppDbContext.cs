using backend_inkspire.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend_inkspire
{
    public class AppDbContext : IdentityDbContext<User, Roles, long>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<Book> Books { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Announcement> Announcements { get; set; }
        public DbSet<Bookmark> Bookmarks { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<UserDiscount> UserDiscounts { get; set; }

        //new DbSets for Cart functionality
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Identity table configurations
            builder.Entity<User>().ToTable("Users");
            builder.Entity<Roles>().ToTable("Roles");
            builder.Entity<IdentityUserRole<long>>().ToTable("UserRoles");
            builder.Entity<IdentityUserClaim<long>>().ToTable("UserClaims");
            builder.Entity<IdentityUserLogin<long>>().ToTable("UserLogins");
            builder.Entity<IdentityRoleClaim<long>>().ToTable("RoleClaims");
            builder.Entity<IdentityUserToken<long>>().ToTable("UserTokens");

            // Book entity configuration
            builder.Entity<Book>().ToTable("Books");
            builder.Entity<Book>()
                .HasIndex(b => b.ISBN)
                .IsUnique();

            builder.Entity<Book>()
                .Property(b => b.PublicationDate)
                .HasConversion(
                    v => v.Kind == DateTimeKind.Local ? v.ToUniversalTime() : v,
                    v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

            builder.Entity<Book>()
                .Property(b => b.ListedDate)
                .HasConversion(
                    v => v.Kind == DateTimeKind.Local ? v.ToUniversalTime() : v,
                    v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

            builder.Entity<Book>()
                .Property(b => b.DiscountStartDate)
                .HasConversion(
                    v => v.HasValue ? (v.Value.Kind == DateTimeKind.Local ? v.Value.ToUniversalTime() : v.Value) : (DateTime?)null,
                    v => v.HasValue ? DateTime.SpecifyKind(v.Value, DateTimeKind.Utc) : (DateTime?)null);

            builder.Entity<Book>()
                .Property(b => b.DiscountEndDate)
                .HasConversion(
                    v => v.HasValue ? (v.Value.Kind == DateTimeKind.Local ? v.Value.ToUniversalTime() : v.Value) : (DateTime?)null,
                    v => v.HasValue ? DateTime.SpecifyKind(v.Value, DateTimeKind.Utc) : (DateTime?)null);

            // Review entity configuration
            builder.Entity<Review>().ToTable("Reviews");
            builder.Entity<Review>()
                .HasOne(r => r.Book)
                .WithMany(b => b.Reviews)
                .HasForeignKey(r => r.BookId)
                .OnDelete(DeleteBehavior.Cascade);

            // Announcement entity configuration
            builder.Entity<Announcement>().ToTable("Announcements");

            // Bookmark entity configuration
            builder.Entity<Bookmark>().ToTable("Bookmarks");
            builder.Entity<Bookmark>()
                .HasIndex(b => new { b.UserId, b.BookId })
                .IsUnique();

            // Order entities configuration
            builder.Entity<Order>().ToTable("Orders");
            builder.Entity<OrderItem>().ToTable("OrderItems");
            builder.Entity<UserDiscount>().ToTable("UserDiscounts");

            // Cart entities configuration
            builder.Entity<Cart>().ToTable("Carts");
            builder.Entity<CartItem>().ToTable("CartItems");

            // Configure relationships for Cart entities
            builder.Entity<Cart>()
                .HasMany(c => c.Items)
                .WithOne(i => i.Cart)
                .HasForeignKey(i => i.CartId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<CartItem>()
                .HasOne(ci => ci.Book)
                .WithMany()
                .HasForeignKey(ci => ci.BookId)
                .OnDelete(DeleteBehavior.Restrict);

            // Ensure each user has only one cart
            builder.Entity<Cart>()
                .HasIndex(c => c.UserId)
                .IsUnique();

            // Seed roles
            builder.Entity<Roles>().HasData(
                new Roles
                {
                    Id = 1,
                    Name = "SuperAdmin",
                    NormalizedName = "SUPERADMIN",
                    ConcurrencyStamp = Guid.NewGuid().ToString()
                },
                new Roles
                {
                    Id = 2,
                    Name = "Staff",
                    NormalizedName = "STAFF",
                    ConcurrencyStamp = Guid.NewGuid().ToString()
                },
                new Roles
                {
                    Id = 3,
                    Name = "Member",
                    NormalizedName = "MEMBER",
                    ConcurrencyStamp = Guid.NewGuid().ToString()
                }
            );

            // Seed SuperAdmin
            var superAdmin = new User
            {
                Id = 1,
                Name = "Anjan",
                UserName = "anjan",
                NormalizedUserName = "ANJAN",
                Email = "anjan@gmail.com",
                NormalizedEmail = "ANJAN@GMAIL.COM",
                EmailConfirmed = true,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            superAdmin.PasswordHash = new PasswordHasher<User>().HashPassword(superAdmin, "anjan@123");
            builder.Entity<User>().HasData(superAdmin);

            // Assign SuperAdmin Role
            builder.Entity<IdentityUserRole<long>>().HasData(
                new IdentityUserRole<long>
                {
                    UserId = 1,
                    RoleId = 1,
                }
            );
        }
    }
}