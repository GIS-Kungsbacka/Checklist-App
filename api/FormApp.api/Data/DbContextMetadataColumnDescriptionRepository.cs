using FormApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FormApp.Api.Data;

public class DbContextMetadataColumnDescriptionRepository : IMetadataColumnDescriptionRepository
{
    private readonly AppDbContext _context;

    public DbContextMetadataColumnDescriptionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<MetadataColumnDescription>> GetAllAsync()
    {
        return await _context.MetadataColumnDescriptions
            .OrderBy(x => x.Gid)
            .ToListAsync();
    }

    public async Task<MetadataColumnDescription?> GetByIdAsync(int gid)
    {
        return await _context.MetadataColumnDescriptions.FindAsync(gid);
    }
}

