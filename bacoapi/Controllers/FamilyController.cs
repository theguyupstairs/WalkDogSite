using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using bacoapi.Account;
using bacoapi.Data;
using bacoapi.Interfaces;
using bacoapi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace bacoapi.Controllers
{

    [Microsoft.AspNetCore.Mvc.Route("bacoapi/family")]
    [ApiController]

    public class FamilyController : ControllerBase
    {

        private readonly ApplicationDBContext _context;
        private readonly IFamilyRepository _familyRepository;

        public FamilyController(ApplicationDBContext context, IFamilyRepository familyRepository)
        {

            _familyRepository = familyRepository;

            _context = context;

        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var family = await _context.Families.Include(f => f.UserWalks).FirstOrDefaultAsync(f => f.FamilyId == id);

            if (family == null)
            {
                return NotFound();
            }
            
            return Ok(family);
        }

        // Create family
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] NewFamilyDto familyDto)
        {

            var family = await _context.Families.FirstOrDefaultAsync(f => f.FamilyName == familyDto.FamilyName);

            if (family == null)
            {
                Family newFamily = new Family
                {
                    FamilyName = familyDto.FamilyName,
                };

                await _familyRepository.CreateAsync(newFamily);

                return CreatedAtAction(nameof(GetById), new { id = family.FamilyId}, newFamily);
            } else
            {
                return Conflict(new { message = "A family with this name already exists." });

            }
        }

    }

}