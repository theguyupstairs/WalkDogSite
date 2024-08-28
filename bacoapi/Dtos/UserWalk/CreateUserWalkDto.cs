using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using bacoapi.Dtos.WalkRoute;

namespace bacoapi.Dtos.UserWalk
{

    public class CreateUserWalkDto 
    {

        public string Email { get; set; }

        public CreateWalkRouteRequestDto CreateWalkDto { get; set; }

    }

}