using FormApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FormApp.Api.Data;

public class DbContextMetadataRepository : IMetadataRepository
{
    private readonly AppDbContext _context;

    public DbContextMetadataRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Metadata>> GetAllAsync()
    {
        return await _context.Metadatas
            .OrderBy(x => x.Gid)
            .ToListAsync();
    }

    public async Task<Metadata?> GetByIdAsync(int gid)
    {
        return await _context.Metadatas.FindAsync(gid);
    }

    public async Task<Metadata> CreateAsync(Metadata item)
    {
        _context.Metadatas.Add(item);
        await _context.SaveChangesAsync();
        return item;
    }

    public async Task<Metadata?> UpdateAsync(int gid, Metadata item)
    {
        var existing = await _context.Metadatas.FindAsync(gid);
        if (existing == null)
        {
            return null;
        }

        existing.ArendeNummerOpenE = item.ArendeNummerOpenE;
        existing.BestallareNamn = item.BestallareNamn;
        existing.BestallareEpost = item.BestallareEpost;
        existing.SakerhetsKlass = item.SakerhetsKlass;
        existing.DataKallaTyp = item.DataKallaTyp;
        existing.SchemaNamn = item.SchemaNamn;
        existing.Namn = item.Namn;
        existing.Beskrivning = item.Beskrivning;
        existing.Ursprung = item.Ursprung;
        existing.Syfte = item.Syfte;
        existing.Metod = item.Metod;
        existing.MetodUrl = item.MetodUrl;
        existing.Projekt = item.Projekt;
        existing.GeografiskBegransning = item.GeografiskBegransning;
        existing.UppdateringsFrekvens = item.UppdateringsFrekvens;
        existing.Fullstandighet = item.Fullstandighet;
        existing.Skalniva = item.Skalniva;
        existing.NyckelOrd = item.NyckelOrd;
        existing.Kategori = item.Kategori;
        existing.Tidsperiod = item.Tidsperiod;
        existing.TidsperiodStartdatum = item.TidsperiodStartdatum;
        existing.TidsperiodSlutdatum = item.TidsperiodSlutdatum;
        existing.TidsUpplosning = item.TidsUpplosning;
        existing.SkapelseDatum = item.SkapelseDatum;
        existing.AnvandarBegransningLicens = item.AnvandarBegransningLicens;
        existing.AnvandarBegransningLicensText = item.AnvandarBegransningLicensText;
        existing.RelateradeResurser = item.RelateradeResurser;
        existing.KolumnBeskrivningUrl = item.KolumnBeskrivningUrl;
        existing.Status = item.Status;
        existing.Handlaggare = item.Handlaggare;
        existing.MetaDataVersion = item.MetaDataVersion;
        // Keep original create-audit values; only update change-audit.
        existing.AndradTidPunkt = item.AndradTidPunkt ?? DateTime.UtcNow;
        existing.AndradAv = item.AndradAv ?? existing.AndradAv;
        existing.SakerhetsklassRiktighet = item.SakerhetsklassRiktighet;
        existing.SakerhetsklassTillganglighet = item.SakerhetsklassTillganglighet;
        existing.MetadataSpecifikationModelversion = item.MetadataSpecifikationModelversion;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int gid)
    {
        var item = await _context.Metadatas.FindAsync(gid);
        if (item == null)
        {
            return false;
        }

        _context.Metadatas.Remove(item);
        await _context.SaveChangesAsync();
        return true;
    }
}

