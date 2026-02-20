using FormApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FormApp.Api.Data;

public class DbContextOrderSummaryRepository : IOrderSummaryRepository
{
    private readonly AppDbContext _context;

    public DbContextOrderSummaryRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<OrderSummary>> GetAllAsync()
    {
        return await _context.OrderSummaries
            .OrderByDescending(x => x.ArendenummerArtvise)
            .ToListAsync();
    }

    public async Task<OrderSummary?> GetByIdAsync(string arendenummerArtvise)
    {
        return await _context.OrderSummaries
            .FirstOrDefaultAsync(x => x.ArendenummerArtvise == arendenummerArtvise);
    }
}
