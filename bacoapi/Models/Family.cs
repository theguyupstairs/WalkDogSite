using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace bacoapi.Models
{
    public class Family
    {
        public int FamilyId { get; set; }
        public string? FamilyName { get; set; }
        public ICollection<UserWalk> UserWalks { get; set; } = new List<UserWalk>();

    }
}