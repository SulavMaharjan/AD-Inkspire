using backend_inkspire.DTOs;
using backend_inkspire.Entities;
using backend_inkspire.Repositories;

namespace backend_inkspire.Services
{
    public interface IAnnouncementService
    {
        Task<IEnumerable<AnnouncementResponseDTO>> GetAllAnnouncementsAsync();
        Task<IEnumerable<AnnouncementResponseDTO>> GetActiveAnnouncementsAsync();
        Task<AnnouncementResponseDTO> GetAnnouncementByIdAsync(int id);
        Task<AnnouncementResponseDTO> CreateAnnouncementAsync(AnnouncementDTO announcementDto);
        Task<AnnouncementResponseDTO> UpdateAnnouncementAsync(int id, AnnouncementDTO announcementDto);
        Task<bool> DeleteAnnouncementAsync(int id);
    }
}

