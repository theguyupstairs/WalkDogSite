using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using bacoapi.Models;

namespace bacoapi.Interfaces 
{

    public interface IWalkRouteRepository
    {
        Task<List<WalkRoute>> GetAllAsync();

        Task<WalkRoute?> GetByIdAsync(int id);

        Task<WalkRoute> CreateAsync(WalkRoute walkRouteModel);
    }


}