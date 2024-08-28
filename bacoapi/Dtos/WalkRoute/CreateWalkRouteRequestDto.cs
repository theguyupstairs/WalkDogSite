using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using bacoapi.Models;

namespace bacoapi.Dtos.WalkRoute
{

    public class CreateWalkRouteRequestDto {

        public int? StartLatitude { get; set; } // Store latitude as a string
        public int? StartLongitude { get; set; } // Store longitude as a string
        public int? EndLatitude { get; set; } // Store latitude as a string
        public int? EndLongitude { get; set; } // Store longitude as a string
        public int? Distance { get; set; }
        public int? Time { get; set; }
        public string? Date { get; set; }
        public required string UserWalkEmail { get; set; }

    }
}