using FormApp.Api.Models;

namespace FormApp.Api.Data;

public class DbContextManagementPlanRepository : IManagementPlanRepository
{
    private readonly AppDbContext _context;

    public DbContextManagementPlanRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ManagementPlan> CreateAsync(ManagementPlan item)
    {
        _context.ManagementPlans.Add(item);
        await _context.SaveChangesAsync();
        return item;
    }

    public async Task<ManagementPlan?> UpdateAsync(int gid, ManagementPlan item)
    {
        var existing = await _context.ManagementPlans.FindAsync(gid);
        if (existing == null)
        {
            return null;
        }

        existing.ArendeNummer = item.ArendeNummer;
        existing.BestallareNamn = item.BestallareNamn;
        existing.BestallareEpost = item.BestallareEpost;
        existing.Sakerhetsklass = item.Sakerhetsklass;
        existing.DatakallaTyp = item.DatakallaTyp;
        existing.Schema = item.Schema;
        existing.Namn = item.Namn;
        existing.Titel = item.Titel;
        existing.DataAgare = item.DataAgare;
        existing.DataForvaltare = item.DataForvaltare;
        existing.DataAdministrator = item.DataAdministrator;
        existing.DataKonsument = item.DataKonsument;
        existing.RedigeringsKalla = item.RedigeringsKalla;
        existing.Publicering = item.Publicering;
        existing.OppnaData = item.OppnaData;
        existing.Arkivering = item.Arkivering;
        existing.ArkiveringTidpunkt = item.ArkiveringTidpunkt;
        existing.Atkomst = item.Atkomst;
        existing.Status = item.Status;
        existing.Handlaggare = item.Handlaggare;
        existing.ForvaltningsplanVersion = item.ForvaltningsplanVersion;
        existing.SkapadTidPunkt = item.SkapadTidPunkt;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int gid)
    {
        var item = await _context.ManagementPlans.FindAsync(gid);
        if (item == null)
        {
            return false;
        }

        _context.ManagementPlans.Remove(item);
        await _context.SaveChangesAsync();
        return true;
    }
}

