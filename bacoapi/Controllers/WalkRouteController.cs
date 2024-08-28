using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using bacoapi.Data;
using bacoapi.Dtos.WalkRoute;
using bacoapi.Interfaces;
using bacoapi.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace bacoapi.Controllers 
{
    [Microsoft.AspNetCore.Mvc.Route("bacoapi/walkroute")]
    [ApiController]

    public class WalkRouteController : ControllerBase
    {

        private readonly ApplicationDBContext _context;
        
        private readonly IWalkRouteRepository _walkRep;

        public WalkRouteController(ApplicationDBContext context, IWalkRouteRepository walkRep) 
        {
            _context = context;
            _walkRep = walkRep;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() 
        {
            var walks = await _walkRep.GetAllAsync();

            var walksDto = walks.Select(s => s.ToWalkRouteDto());

            return Ok(walks);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var walk = await _context.WalkRoutes.FindAsync(id);

            if (walk == null) 
            {
                return NotFound();
            }

            return Ok(walk.ToWalkRouteDto());
        }

        // TODO: CREATE BY USER ID 
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateWalkRouteRequestDto walkRouteDto)
        {
            var walkRouteModel = walkRouteDto.ToWalkRouteFromCreateDto();
            await _walkRep.CreateAsync(walkRouteModel);
            return CreatedAtAction(nameof(GetById), new { id = walkRouteModel.Id }, walkRouteModel.ToWalkRouteDto());
        }
    }
}