using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using bacoapi.Data;
using bacoapi.Dtos.WalkRoute;

namespace bacoapi.Dtos.WalkRoute
{

    public class WalkRouteDto 
    {
        // Note to self: this dto is completely useless. i was just seeing how to make a dto. only difference with real model is no time
        public required int Id { get; set; }
        public int? StartLatitude { get; set; } // Store latitude as a string
        public int? StartLongitude { get; set; } // Store longitude as a string
        public int? EndLatitude { get; set; } // Store latitude as a string
        public int? EndLongitude { get; set; } // Store longitude as a string
        public int? Distance { get; set; }
        public string? Date { get; set; }
        public int? Time { get; set; }
    }

} 