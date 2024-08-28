using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using bacoapi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace bacoapi.Data
{
    public class ApplicationDBContext : IdentityDbContext<AppUser>
    {
        public ApplicationDBContext(DbContextOptions dbContextOptions)
        : base(dbContextOptions)
        {
            
        }
        
        public DbSet<WalkRoute> WalkRoutes { get; set; }

        public DbSet<bacoapi.Models.UserWalk> UserWalks { get; set; }

        public DbSet<bacoapi.Models.Family> Families { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            List<IdentityRole> roles = new List<IdentityRole> 
            {
                new IdentityRole
                {
                    Name = "admin",
                    NormalizedName = "ADMIN"
                },
                new IdentityRole 
                {
                    Name = "User",
                    NormalizedName = "USER"
                },
            };
            builder.Entity<IdentityRole>().HasData(roles);

            builder.Entity<Family>()
                .HasIndex(f => f.FamilyName)
                .IsUnique();

            }


    }
}