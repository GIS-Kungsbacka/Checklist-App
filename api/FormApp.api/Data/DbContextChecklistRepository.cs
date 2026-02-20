using FormApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FormApp.Api.Data;

public class DbContextChecklistRepository : IChecklistRepository
{
    private readonly AppDbContext _context;

    public DbContextChecklistRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Checklist>> GetAllAsync()
    {
        return await _context.Checklists
            .OrderByDescending(x => x.Gid)
            .ToListAsync();
    }

    public async Task<Checklist?> GetByIdAsync(int gid)
    {
        return await _context.Checklists.FindAsync(gid);
    }

    public async Task<Checklist> CreateAsync(Checklist item)
    {
        _context.Checklists.Add(item);
        await _context.SaveChangesAsync();
        return item;
    }

    public async Task<Checklist?> UpdateAsync(int gid, Checklist item)
    {
        var existing = await _context.Checklists.FindAsync(gid);
        if (existing == null)
        {
            return null;
        }

        existing.ArendenummerArtvise = item.ArendenummerArtvise;
        existing.Dataunderlag = item.Dataunderlag;
        existing.Dataadministrator = item.Dataadministrator;
        existing.Malgrupper = item.Malgrupper;
        existing.NyttjandeInterntExternt = item.NyttjandeInterntExternt;
        existing.Leverans = item.Leverans;
        existing.LeveransArbetstimmar = item.LeveransArbetstimmar;
        existing.Kategori = item.Kategori;
        existing.KategoriTyp = item.KategoriTyp;
        existing.Prioritet = item.Prioritet;
        existing.AntagenJaNej = item.AntagenJaNej;
        existing.AntagenJaNejMotivering = item.AntagenJaNejMotivering;
        existing.Handlaggare = item.Handlaggare;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int gid)
    {
        var item = await _context.Checklists.FindAsync(gid);
        if (item == null)
        {
            return false;
        }

        _context.Checklists.Remove(item);
        await _context.SaveChangesAsync();
        return true;
    }
}
