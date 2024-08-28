using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace bacoapi.Models
{

    public class WalkRoute 
    {
        public int Id { get; set; }
        public int? StartLatitude { get; set; } // Store latitude as a string
        public int? StartLongitude { get; set; } // Store longitude as a string
        public int? EndLatitude { get; set; } // Store latitude as a string
        public int? EndLongitude { get; set; } // Store longitude as a string
        public int? Distance { get; set; }
        public int? Time { get; set; }
        public DateTime? Date { get; set; }
        // Foreign key to UserWalk
        public required string UserWalkEmail { get; set; }

    }
}