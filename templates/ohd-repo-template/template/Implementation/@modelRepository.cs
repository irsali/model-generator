using OHD.Contracts.Repositries;
using OHD.Contracts.Services;
using OHD.Data.EfCore.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OHD.Repositories
{

    public class @modelRepository : Repository<Tb@model, @tId>, I@modelRepository
    {
        public @modelRepository(OHDContext context) : base(context)
        {
        }
    }
}
