using FormApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FormApp.Api.Data;

public class DbContextBestallningsspecifikationRepository : IBestallningsspecifikationRepository
{
    private readonly AppDbContext _context;

    public DbContextBestallningsspecifikationRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Bestallningsspecifikation>> GetAllAsync()
    {
        return await _context.Bestallningsspecifikationer
            .OrderByDescending(x => x.BestallningGid)
            .ToListAsync();
    }

    public async Task<Bestallningsspecifikation?> GetByIdAsync(int bestallningGid)
    {
        return await _context.Bestallningsspecifikationer
            .FirstOrDefaultAsync(x => x.BestallningGid == bestallningGid);
    }
}
