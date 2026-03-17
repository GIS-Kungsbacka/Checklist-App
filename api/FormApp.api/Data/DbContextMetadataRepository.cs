using FormApp.Api.Models;

namespace FormApp.Api.Data;

public class DbContextMetadataRepository : IMetadataRepository
{
    private readonly AppDbContext _context;

    public DbContextMetadataRepository(AppDbContext context)
    {
        _context = context;
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

        existing.SakerhetsKlassDokument = item.SakerhetsKlassDokument;
        existing.ArendeNummer = item.ArendeNummer;
        existing.BestallareNamn = item.BestallareNamn;
        existing.BestallareEpost = item.BestallareEpost;
        existing.SakerhetsKlass = item.SakerhetsKlass;
        existing.DataKallaTyp = item.DataKallaTyp;
        existing.Schema = item.Schema;
        existing.Name = item.Name;
        existing.Beskrivning = item.Beskrivning;
        existing.Syfte = item.Syfte;
        existing.Datakalla = item.Datakalla;
        existing.Metod = item.Metod;
        existing.Projekt = item.Projekt;
        existing.GeografiskBegransning = item.GeografiskBegransning;
        existing.UppdateringsFrekvens = item.UppdateringsFrekvens;
        existing.Fullstandighet = item.Fullstandighet;
        existing.Skalnivå = item.Skalnivå;
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
        existing.Status = item.Status;
        existing.Handlaggare = item.Handlaggare;
        existing.MetaDataVersion = item.MetaDataVersion;
        existing.SkapadTidPunkt = item.SkapadTidPunkt;

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

