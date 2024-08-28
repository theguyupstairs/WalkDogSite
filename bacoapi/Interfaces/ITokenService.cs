using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using bacoapi.Models;

namespace bacoapi.Interfaces
{

    public interface ITokenService
    {
        string CreateToken(AppUser user);
    }

}