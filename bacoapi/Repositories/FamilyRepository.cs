using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using bacoapi.Account;
using bacoapi.Data;
using bacoapi.Interfaces;
using bacoapi.Models;

namespace bacoapi.Repositories
{

    public class FamilyRepository : IFamilyRepository
    {

        private readonly ApplicationDBContext _context;
        public FamilyRepository(ApplicationDBContext context)
        {
            this._context = context;
        }

        public async Task<Family> CreateAsync(Family family)
        {
            await _context.Families.AddAsync(family);
            await _context.SaveChangesAsync();
            return family;
        }
    }

}