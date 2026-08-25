using FormApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FormApp.Api.Data;

public class DbContextManagementPlanRepository : IManagementPlanRepository
{
    private readonly AppDbContext _context;

    public DbContextManagementPlanRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ManagementPlan>> GetAllAsync()
    {
        return await _context.ManagementPlans
            .OrderBy(x => x.Gid)
            .ToListAsync();
    }

    public async Task<ManagementPlan?> GetByIdAsync(int gid)
    {
        return await _context.ManagementPlans.FindAsync(gid);
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

        existing.ArendeNummberOpenE = item.ArendeNummberOpenE;
        existing.BestallareNamn = item.BestallareNamn;
        existing.BestallareEpost = item.BestallareEpost;
        existing.Sakerhetsklass = item.Sakerhetsklass;
        existing.DatakallaTyp = item.DatakallaTyp;
        existing.SchemaNamn = item.SchemaNamn;
        existing.Namn = item.Namn;
        existing.Titel = item.Titel;
        existing.DataAgare = item.DataAgare;
        existing.DataForvaltare = item.DataForvaltare;
        existing.DataAdministrator = item.DataAdministrator;
        existing.DataKonsument = item.DataKonsument;
        existing.RedigeringsKalla = item.RedigeringsKalla;
        existing.OppnaData = item.OppnaData;
        existing.DokumentSkUrl = item.DokumentSkUrl;
        existing.DokuementInfoUrl = item.DokuementInfoUrl;
        existing.OvrigInformation = item.OvrigInformation;
        existing.KritiskDatamangd = item.KritiskDatamangd;
        existing.Arkivering = item.Arkivering;
        existing.ArkiveringTidpunkt = item.ArkiveringTidpunkt;
        existing.Publicerad = item.Publicerad;
        existing.PubliceradOppnaData = item.PubliceradOppnaData;
        existing.Atkomst = item.Atkomst;
        existing.Integration = item.Integration;
        existing.Status = item.Status;
        existing.Handlaggare = item.Handlaggare;
        existing.ForvaltningsplanVersion = item.ForvaltningsplanVersion;
        existing.SkapadTidPunkt = item.SkapadTidPunkt;
        existing.SkapadAv = item.SkapadAv;
        existing.AndradTidPunkt = item.AndradTidPunkt;
        existing.AndradAv = item.AndradAv;
        existing.ForvaltningsplanModelversion = item.ForvaltningsplanModelversion;

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

