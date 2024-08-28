using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using bacoapi.Data;
using bacoapi.Models;

namespace bacoapi.Interfaces
{

    public interface IFamilyRepository
    {

        Task<Family> CreateAsync(Family family);

    }

}