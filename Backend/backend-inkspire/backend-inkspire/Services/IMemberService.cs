using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend_inkspire.DTOs;
using backend_inkspire.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend_inkspire.Services
{
    public interface IMemberService
    {
        Task<IEnumerable<UserDTO>> GetAllMembersAsync();
        Task<bool> DeleteMemberAsync(long id);
    }
}