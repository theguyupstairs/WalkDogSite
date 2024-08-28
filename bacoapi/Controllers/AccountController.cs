using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using bacoapi.Account;
using bacoapi.Data;
using bacoapi.Interfaces;
using bacoapi.Models;
using bacoapi.Service;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace bacoapi.Controllers 
{

    [Route("bacoapi/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {

        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ApplicationDBContext _context;
        private readonly ILogger<AccountController> _ilogger;
        public AccountController(ApplicationDBContext context, UserManager<AppUser> userManager, ITokenService tokenService, SignInManager<AppUser> signInManager, ILogger<AccountController> ilogger)
        {
            this._context = context;
            this._userManager = userManager;  
            this._tokenService = tokenService;
            this._signInManager = signInManager;
            this._ilogger = ilogger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var appUser = new AppUser
                {
                    UserName = registerDto.Email,
                    Email = registerDto.Email
                };

                var createdUser = await _userManager.CreateAsync(appUser, registerDto.Password);

                if (createdUser.Succeeded)
                {
                    var roleResult = await _userManager.AddToRoleAsync(appUser, "User");
                    if (roleResult.Succeeded) 
                    {
                        await _context.SaveChangesAsync();

                    try
                    {

                        await _context.UserWalks.AddAsync(
                            new UserWalk
                            {
                                Email = registerDto.Email,
                                AppUser = appUser,
                                FullName = registerDto.Name

                            });

                        await _context.SaveChangesAsync();
                    }
                    catch (Exception ex)
                    {
                        _ilogger.LogError("Error saving UserWalk: " + ex.Message + ex.InnerException?.Message);
                    }

                        return Ok(
                            new NewUserDto
                            {
                                UserName = appUser.UserName,
                                Email = appUser.Email,
                                FullName = registerDto.Name,
                                Token = _tokenService.CreateToken(appUser)
                            }
                        );
                    } 
                    else 
                    {
                        return StatusCode(500, roleResult.Errors);
                    }
                } 
                else 
                {
                    return StatusCode(500, createdUser.Errors);
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == loginDto.Username.ToLower());

            // TODO: INTEGRATE NAME INTO USERMANAGER AS WELL, DONT USE USERWALK
            var userWalk = await _context.UserWalks.FirstOrDefaultAsync(uw => uw.Email == loginDto.Username);

            if (user == null)
                return Unauthorized("Invalid username");

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded)
                return Unauthorized("Username not found and/or password incorrect");


            return Ok(
                new NewUserDto
                {
                    UserName = user.UserName,
                    Email = user.Email,
                    FullName = userWalk.FullName,
                    Token = _tokenService.CreateToken(user)
                }
            );
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllAsync()
        {
            var users = await _context.Users.ToListAsync();

            return Ok(users);
        }

    }

}