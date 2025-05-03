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

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // PostgreSQL uses lowercase table names by convention
            // Set the table names with correct casing
            builder.Entity<User>().ToTable("Users");
            builder.Entity<Roles>().ToTable("Roles");
            builder.Entity<IdentityUserRole<long>>().ToTable("User Roles");
            builder.Entity<IdentityUserClaim<long>>().ToTable("UserClaims");
            builder.Entity<IdentityUserLogin<long>>().ToTable("UserLogins");
            builder.Entity<IdentityRoleClaim<long>>().ToTable("RoleClaims");
            builder.Entity<IdentityUserToken<long>>().ToTable("UserTokens");

            // Seed Roles
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

            // Seed SuperAdmin User
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

            // Assign SuperAdmin Role to User
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