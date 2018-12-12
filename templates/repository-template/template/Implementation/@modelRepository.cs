using System;
using System.Collections.Generic;
using System.Text;
using SAMCDSO.Model;
using SAMCDSO.Repository.Interfaces;

namespace SAMCDSO.Repository.Implementation
{
    public class @modelRepository : Repository<@model, @type>, I@modelRepository
    {
        public @modelRepository(AppDbContext context) : base(context)
        {
        }
    }
}
