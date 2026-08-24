using FormApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FormApp.Api.Data;

public class DbContextMetadataTechDescriptionRepository : IMetadataTechDescriptionRepository
{
    private readonly AppDbContext _context;

    public DbContextMetadataTechDescriptionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<MetadataTechDescription>> GetAllAsync()
    {
        return await _context.MetadataTechDescriptions
            .OrderBy(x => x.Gid)
            .ToListAsync();
    }

    public async Task<MetadataTechDescription?> GetByIdAsync(int gid)
    {
        return await _context.MetadataTechDescriptions.FindAsync(gid);
    }
}
