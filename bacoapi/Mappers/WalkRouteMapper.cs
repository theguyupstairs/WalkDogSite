using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using bacoapi.Data;
using bacoapi.Dtos.WalkRoute;
using bacoapi.Models;

namespace bacoapi.Mappers 
{
    public static class WalkRouteMappers
    {

        public static WalkRouteDto ToWalkRouteDto(this WalkRoute walkRouteModel) 
        {
            return new WalkRouteDto 
            {
               Id = walkRouteModel.Id,
               StartLatitude = walkRouteModel.StartLatitude,
               StartLongitude = walkRouteModel.StartLongitude,
               EndLatitude = walkRouteModel.EndLatitude,
               EndLongitude = walkRouteModel.EndLongitude,
               Distance = walkRouteModel.Distance
            };
        }

        public static WalkRoute ToWalkRouteFromCreateDto(this CreateWalkRouteRequestDto walkRouteDto)
        {

            DateTime dateTime = DateTime.ParseExact(walkRouteDto.Date, "MM-dd-yyyy", CultureInfo.InvariantCulture);

            return new WalkRoute
            {
                StartLatitude = walkRouteDto.StartLatitude,
                StartLongitude = walkRouteDto.StartLongitude,
                EndLatitude = walkRouteDto.EndLatitude,
                EndLongitude = walkRouteDto.EndLongitude,
                Distance = walkRouteDto.Distance,
                Time = walkRouteDto.Time,
                Date = dateTime,
                UserWalkEmail = walkRouteDto.UserWalkEmail
            };
        }

    }
} 