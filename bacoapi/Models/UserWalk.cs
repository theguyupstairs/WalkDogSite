using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace bacoapi.Models
{

    public class UserWalk 
    {

        [Key, ForeignKey("Id")]
        public string? Email { get; set; } = string.Empty;

        public virtual AppUser AppUser { get; set; }
        public string? FullName { get; set; }
        public ICollection<WalkRoute> Walks { get; set; } = new List<WalkRoute>();
        public int? FamilyId { get; set; }
        public Family Family { get; set; }
    }
}