using FormApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FormApp.Api.Data;

public class DbContextBestallaUppdragFrageformularRepository : IBestallaUppdragFrageformularRepository
{
    private readonly AppDbContext _context;

    public DbContextBestallaUppdragFrageformularRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<BestallaUppdragFrageformular>> GetAllAsync()
    {
        return await _context.BestallaUppdragFrageformulars
            .OrderByDescending(x => x.Gid)
            .ToListAsync();
    }

    public async Task<BestallaUppdragFrageformular?> GetByIdAsync(int gid)
    {
        return await _context.BestallaUppdragFrageformulars.FindAsync(gid);
    }

    public async Task<BestallaUppdragFrageformular> CreateAsync(BestallaUppdragFrageformular item)
    {
        _context.BestallaUppdragFrageformulars.Add(item);
        await _context.SaveChangesAsync();
        return item;
    }

    public async Task<BestallaUppdragFrageformular?> UpdateAsync(int gid, BestallaUppdragFrageformular item)
    {
        var existing = await _context.BestallaUppdragFrageformulars.FindAsync(gid);
        if (existing == null)
        {
            return null;
        }

        existing.Arendenummer = item.Arendenummer;
        existing.Dataunderlag = item.Dataunderlag;
        existing.Dataadministrator = item.Dataadministrator;
        existing.Malgrupper = item.Malgrupper;
        existing.NyttjandeInterntExternt = item.NyttjandeInterntExternt;
        existing.Leverans = item.Leverans;
        existing.LeveransArbetstimmar = item.LeveransArbetstimmar;
        existing.Kategori = item.Kategori;
        existing.KategoriTyp = item.KategoriTyp;
        existing.Parioritet = item.Parioritet;
        existing.AntagenJaNej = item.AntagenJaNej;
        existing.AntagenJaNejMotivering = item.AntagenJaNejMotivering;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int gid)
    {
        var item = await _context.BestallaUppdragFrageformulars.FindAsync(gid);
        if (item == null)
        {
            return false;
        }

        _context.BestallaUppdragFrageformulars.Remove(item);
        await _context.SaveChangesAsync();
        return true;
    }
}
