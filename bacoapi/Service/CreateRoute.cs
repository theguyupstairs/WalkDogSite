using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

namespace bacoapi.Service 
{

    public class Service
    {

        private readonly IWalkRouteRepository _iWalkRouteRepository;
        public Service(IWalkRouteRepository iWalkRouteRepository)
        {
            this._iWalkRouteRepository = iWalkRouteRepository;
        }

        ///THIS SERBICE ISNT NECESSARY, JUST IMPLEMENT INTERFACE
/*         public async Task<IActionResult> Create([FromBody] CreateWalkRouteRequestDto walkRouteDto)
        {
            var walkRouteModel = walkRouteDto.ToWalkRouteFromCreateDto();
            await _iWalkRouteRepository.CreateAsync(walkRouteModel);
            return CreatedAtActionResult(nameof(GetById), new { id = walkRouteModel.Id }, walkRouteModel.ToWalkRouteDto());
        } */

    }

}