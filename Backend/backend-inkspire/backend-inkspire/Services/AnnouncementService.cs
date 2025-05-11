using backend_inkspire.DTOs;
using backend_inkspire.Entities;
using backend_inkspire.Repositories;
using backend_inkspire.Services;

public class AnnouncementService : IAnnouncementService
{
    private readonly IAnnouncementRepository _repository;
    private readonly INotificationService _notificationService;
    private readonly ILogger<AnnouncementService> _logger;

    public AnnouncementService(
        IAnnouncementRepository repository,
        INotificationService notificationService,
        ILogger<AnnouncementService> logger)
    {
        _repository = repository;
        _notificationService = notificationService;
        _logger = logger;
    }

    public async Task<IEnumerable<AnnouncementResponseDTO>> GetAllAnnouncementsAsync()
    {
        var announcements = await _repository.GetAllAnnouncementsAsync();
        return announcements.Select(MapToResponseDTO);
    }

    public async Task<IEnumerable<AnnouncementResponseDTO>> GetActiveAnnouncementsAsync()
    {
        var announcements = await _repository.GetActiveAnnouncementsAsync();
        return announcements.Select(MapToResponseDTO);
    }

    public async Task<AnnouncementResponseDTO> GetAnnouncementByIdAsync(int id)
    {
        var announcement = await _repository.GetAnnouncementByIdAsync(id);
        return announcement != null ? MapToResponseDTO(announcement) : null;
    }

    public async Task<AnnouncementResponseDTO> CreateAnnouncementAsync(AnnouncementDTO announcementDto)
    {
        var announcement = new Announcement
        {
            Title = announcementDto.Title,
            Content = announcementDto.Content,
            StartDate = announcementDto.StartDate.ToUniversalTime(),
            EndDate = announcementDto.EndDate.ToUniversalTime(),
            AnnouncementType = announcementDto.AnnouncementType,
            CreatedDate = DateTime.UtcNow
        };

        var createdAnnouncement = await _repository.CreateAnnouncementAsync(announcement);
        var responseDto = MapToResponseDTO(createdAnnouncement);

        // Send notification to all connected users if the announcement is active
        if (createdAnnouncement.IsActive)
        {
            try
            {
                await _notificationService.BroadcastNotificationAsync(new
                {
                    type = "NEW_ANNOUNCEMENT",
                    data = responseDto
                });
                _logger.LogInformation($"Announcement notification broadcast for ID: {createdAnnouncement.Id}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error broadcasting announcement notification");
            }
        }

        return responseDto;
    }

    public async Task<AnnouncementResponseDTO> UpdateAnnouncementAsync(int id, AnnouncementDTO announcementDto)
    {
        var existingAnnouncement = await _repository.GetAnnouncementByIdAsync(id);
        if (existingAnnouncement == null)
            return null;

        existingAnnouncement.Title = announcementDto.Title;
        existingAnnouncement.Content = announcementDto.Content;
        existingAnnouncement.StartDate = announcementDto.StartDate.ToUniversalTime();
        existingAnnouncement.EndDate = announcementDto.EndDate.ToUniversalTime();
        existingAnnouncement.AnnouncementType = announcementDto.AnnouncementType;

        var updatedAnnouncement = await _repository.UpdateAnnouncementAsync(existingAnnouncement);
        var responseDto = MapToResponseDTO(updatedAnnouncement);

        // Send notification about the update if the announcement is active
        if (updatedAnnouncement.IsActive)
        {
            try
            {
                await _notificationService.BroadcastNotificationAsync(new
                {
                    type = "UPDATED_ANNOUNCEMENT",
                    data = responseDto
                });
                _logger.LogInformation($"Announcement update notification broadcast for ID: {updatedAnnouncement.Id}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error broadcasting announcement update notification");
            }
        }

        return responseDto;
    }

    public async Task<bool> DeleteAnnouncementAsync(int id)
    {
        var announcement = await _repository.GetAnnouncementByIdAsync(id);
        if (announcement == null)
            return false;

        var result = await _repository.DeleteAnnouncementAsync(id);

        if (result)
        {
            try
            {
                await _notificationService.BroadcastNotificationAsync(new
                {
                    type = "DELETED_ANNOUNCEMENT",
                    data = id
                });
                _logger.LogInformation($"Announcement deletion notification broadcast for ID: {id}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error broadcasting announcement deletion notification");
            }
        }

        return result;
    }

    private AnnouncementResponseDTO MapToResponseDTO(Announcement announcement)
    {
        return new AnnouncementResponseDTO
        {
            Id = announcement.Id,
            Title = announcement.Title,
            Content = announcement.Content,
            StartDate = announcement.StartDate,
            EndDate = announcement.EndDate,
            IsActive = announcement.IsActive,
            AnnouncementType = announcement.AnnouncementType,
            CreatedDate = announcement.CreatedDate
        };
    }
}

