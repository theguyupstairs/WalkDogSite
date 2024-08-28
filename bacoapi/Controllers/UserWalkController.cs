using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using bacoapi.Account;
using bacoapi.Data;
using bacoapi.Dtos.UserWalk;
using bacoapi.Dtos.WalkRoute;
using bacoapi.Interfaces;
using bacoapi.Mappers;
using bacoapi.Models;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace bacoapi.Controllers 
{
    
    [Microsoft.AspNetCore.Mvc.Route("bacoapi/userwalk")]
    [ApiController]
    public class UserWalkController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly IWalkRouteRepository _walkRouteRepository;
        private readonly IFamilyRepository _familyRepository;
        private readonly ILogger<UserWalkController> _logger;

        public UserWalkController(ApplicationDBContext context, IWalkRouteRepository walkRouteRepository, IFamilyRepository familyRepository
        , ILogger<UserWalkController> logger)
        {
            this._context = context;
            this._walkRouteRepository = walkRouteRepository;
            this._familyRepository = familyRepository;
            this._logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() 
        {
            var userWalks = await _context.UserWalks.Include(uw => uw.Family).ToListAsync();

            return Ok(userWalks);
        }

        [HttpGet("{email}/info")]
        public async Task<IActionResult> GetUserInfo([FromRoute] string email) {
            var userWalk = await _context.UserWalks.Include(uw => uw.Family).FirstOrDefaultAsync(uw => uw.Email == email);
            return Ok(userWalk);
        }

        [HttpGet("{user_email}")]
        public async Task<IActionResult> GetWalksByUser([FromRoute] string user_email)
        {
            var allGroupedWalks = new Dictionary<string, Dictionary<int, Dictionary<string, List<WalkRoute>>>>();

            var userWalk = await _context.UserWalks.Include(uw => uw.Walks).Include(uw => uw.Family).ThenInclude(f => f.UserWalks).ThenInclude(uws => uws.Walks).FirstOrDefaultAsync(uw => uw.Email == user_email);

            if (userWalk == null)
            {
                return NotFound();
            }

            foreach(UserWalk user in userWalk.Family.UserWalks)
            {
                if (user != null)
                {
                    // calculate week number
                    // get day of the week 
                    // Add the user's name as the top-level key
                    allGroupedWalks[user.FullName] = user.Walks.GroupBy(WalkRoute => 
                        CultureInfo.InvariantCulture.Calendar.GetWeekOfYear(
                        WalkRoute.Date.Value, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday))
                            .ToDictionary(
                                weekIndex => weekIndex.Key,
                                weekIndex => weekIndex
                                .GroupBy(route => route.Date.Value.DayOfWeek.ToString())
                                    .ToDictionary(
                                        dayIndex => dayIndex.Key,
                                        dayIndex => dayIndex.ToList()
                                    )
                            );

                    _logger.LogError(user.Email);

                    //allGroupedWalks.Add(groupedWalks);
                }
            }

            return Ok(allGroupedWalks);
        }

        [HttpPut("modify-family")]
        public async Task<IActionResult> UpdateFamily([FromBody] ModifyFamilyDto modifyFamilyDto)
        {

            var userWalk = await _context.UserWalks.Include(uw => uw.Family).FirstOrDefaultAsync(uw => uw.Email == modifyFamilyDto.UserEmail);

            if (userWalk != null)
            {
                var family = userWalk.Family;   

                // check if family with input name exists
                var userFamily = await _context.Families.FirstOrDefaultAsync(f => f.FamilyName == modifyFamilyDto.FamilyName);

                if (userFamily != null) 
                {
                    userWalk.Family = userFamily;
                    await _context.SaveChangesAsync();

                } else 
                {
                    if (family != null)
                    {
                        userWalk.Family.FamilyName = modifyFamilyDto.FamilyName;
                        await _context.SaveChangesAsync();
                    } else 
                    {
                        Family newFamily = new Family
                        {
                            FamilyName = modifyFamilyDto.FamilyName
                        };
                        await _familyRepository.CreateAsync(newFamily);
                        userWalk.Family = newFamily;
                        await _context.SaveChangesAsync();  
                    }

                }

                // TODO: check that old family isnt empty of userwalks, if empty, delete family
            } else 
            {
                return NotFound("User not found");
            }

            return Ok(userWalk);

        }

        // TODO: UPDATE LIST OF WALKS (WATCH VIDEO)

        [HttpPost("save-route")]
        public async Task<IActionResult> SaveRoute([FromBody] CreateWalkRouteRequestDto walkRouteRequestDto)
        {
            try
            {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
                
            // find (already created userwalk model by email (using primary key))
            var userWalk = _context.UserWalks.FirstOrDefault(uw => uw.Email == walkRouteRequestDto.UserWalkEmail);
            
            WalkRoute walkRouteModel = walkRouteRequestDto.ToWalkRouteFromCreateDto();

            var walkRouteCreated = await _walkRouteRepository.CreateAsync(walkRouteModel);

            // save changes
            await _context.SaveChangesAsync();

            return Ok(walkRouteCreated);

            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = "An internal server error occurred. Please try again later." });

            }

        }

    }

}