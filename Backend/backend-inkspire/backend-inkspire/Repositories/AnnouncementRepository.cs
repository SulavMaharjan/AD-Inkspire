using backend_inkspire.Entities;
using backend_inkspire.Repositories;
using backend_inkspire;
using Microsoft.EntityFrameworkCore;

public class AnnouncementRepository : IAnnouncementRepository
{
    private readonly AppDbContext _context;

    public AnnouncementRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Announcement>> GetAllAnnouncementsAsync()
    {
        return await _context.Announcements
            .OrderByDescending(a => a.CreatedDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Announcement>> GetActiveAnnouncementsAsync()
    {
        var now = DateTime.UtcNow;
        return await _context.Announcements
            .Where(a => a.StartDate <= now && a.EndDate >= now)
            .OrderByDescending(a => a.CreatedDate)
            .ToListAsync();
    }

    public async Task<Announcement> GetAnnouncementByIdAsync(int id)
    {
        return await _context.Announcements.FindAsync(id);
    }

    public async Task<Announcement> CreateAnnouncementAsync(Announcement announcement)
    {
        _context.Announcements.Add(announcement);
        await _context.SaveChangesAsync();
        return announcement;
    }

    public async Task<Announcement> UpdateAnnouncementAsync(Announcement announcement)
    {
        _context.Entry(announcement).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return announcement;
    }

    public async Task<bool> DeleteAnnouncementAsync(int id)
    {
        var announcement = await _context.Announcements.FindAsync(id);
        if (announcement == null)
            return false;

        _context.Announcements.Remove(announcement);
        await _context.SaveChangesAsync();
        return true;
    }
}