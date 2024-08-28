using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using bacoapi.Data;
using bacoapi.Interfaces;
using bacoapi.Models;
using Microsoft.EntityFrameworkCore;

namespace bacoapi.Repositories
{

    public class WalkRouteRepository : IWalkRouteRepository 
    {
        private readonly ApplicationDBContext _context;

        public WalkRouteRepository(ApplicationDBContext context) 
        {
            _context = context;
        }

        public async Task<List<WalkRoute>> GetAllAsync()
        {
            return await _context.WalkRoutes.ToListAsync();
        }

        public async Task<WalkRoute?> GetByIdAsync(int id)
        {
            return await _context.WalkRoutes.FindAsync(id);
        }

        public async Task<WalkRoute> CreateAsync(WalkRoute walkRouteModel)
        {
            await _context.WalkRoutes.AddAsync(walkRouteModel);
            await _context.SaveChangesAsync();  
            return walkRouteModel;
        }
    }

}