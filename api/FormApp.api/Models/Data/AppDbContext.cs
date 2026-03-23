using FormApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FormApp.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

  
    public DbSet<Checklist> Checklists => Set<Checklist>();
    public DbSet<OrderSummary> OrderSummaries => Set<OrderSummary>();
    public DbSet<Metadata> Metadatas => Set<Metadata>();
    public DbSet<ManagementPlan> ManagementPlans => Set<ManagementPlan>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        
        
        // Configure Checklist entity (table: bestalla_uppdrag_frageformular)
        modelBuilder.Entity<Checklist>()
            .ToTable("bestalla_uppdrag_frageformular","idebank")
            .HasKey(x => x.Gid);
        
        // Map property names to database column names (snake_case to PascalCase)
        modelBuilder.Entity<Checklist>()
            .Property(x => x.Gid)
            .HasColumnName("gid");
        modelBuilder.Entity<Checklist>()
            .Property(x => x.ArendenummerArtvise)
            .HasColumnName("arendenummer_artvise");
        modelBuilder.Entity<Checklist>()
            .Property(x => x.Dataunderlag)
            .HasColumnName("dataunderlag");
        modelBuilder.Entity<Checklist>()
            .Property(x => x.Dataadministrator)
            .HasColumnName("dataadministrator");
        modelBuilder.Entity<Checklist>()
            .Property(x => x.Malgrupper)
            .HasColumnName("malgrupper");
        modelBuilder.Entity<Checklist>()
            .Property(x => x.NyttjandeInterntExternt)
            .HasColumnName("nyttjande_internt_externt");
        modelBuilder.Entity<Checklist>()
            .Property(x => x.Leverans)
            .HasColumnName("leverans");
        modelBuilder.Entity<Checklist>()
            .Property(x => x.LeveransArbetstimmar)
            .HasColumnName("leverans_arbetstimmar");
        modelBuilder.Entity<Checklist>()
            .Property(x => x.Kategori)
            .HasColumnName("kategori");
        modelBuilder.Entity<Checklist>()
            .Property(x => x.KategoriTyp)
            .HasColumnName("kategori_typ");
        modelBuilder.Entity<Checklist>()
            .Property(x => x.Prioritet)
            .HasColumnName("prioritet");
        modelBuilder.Entity<Checklist>()
            .Property(x => x.AntagenJaNej)
            .HasColumnName("antagen_ja_nej");
        modelBuilder.Entity<Checklist>()
            .Property(x => x.AntagenJaNejMotivering)
            .HasColumnName("antagen_ja_nej_motivering");
        modelBuilder.Entity<Checklist>()
           .Property(x => x.Handlaggare)
           .HasColumnName("handlaggare");
        modelBuilder.Entity<Checklist>()
            .Property(x => x.Tabell)
            .HasColumnName("tabell");
        modelBuilder.Entity<Checklist>()
            .Property(x => x.Wms)
            .HasColumnName("wms");
        modelBuilder.Entity<Checklist>()
            .Property(x => x.Fme)
            .HasColumnName("fme");
        modelBuilder.Entity<Checklist>()
            .Property(x => x.Redigering)
            .HasColumnName("redigering");
        modelBuilder.Entity<Checklist>()
            .Property(x => x.Kopiering)
            .HasColumnName("kopiering");
        modelBuilder.Entity<Checklist>()
            .Property(x => x.Information)
            .HasColumnName("information");
        modelBuilder.Entity<Checklist>()
            .Property(x => x.Kommentar)
            .HasColumnName("kommentar");
        modelBuilder.Entity<Checklist>()
            .Property(x => x.Levererad)
            .HasColumnName("levererad");
        modelBuilder.Entity<Checklist>()
            .Property(x => x.VerksamhetsKritiskData)
            .HasColumnName("verksamhetskritisk_data");

        // Read-only view: orderSummary
        modelBuilder.Entity<OrderSummary>()
            .ToView("bestallningsspecifikation","idebank")
            .HasKey(x => x.ArendenummerArtvise);
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.ArendenummerArtvise).HasColumnName("arendenummer_artvise");
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.ArendenummerOpenE).HasColumnName("arendenummer_open_e");
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.BestallareEpost).HasColumnName("bestallare_epost");
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.BestallareOrganisation).HasColumnName("bestallare_organisation");
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.BestallareTjanstetitel).HasColumnName("bestallare_tjanstetitel");
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.DatumInkommet).HasColumnName("datum_inkommet");
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.Beskrivning).HasColumnName("beskrivning");
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.Nytta).HasColumnName("nytta");
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.SistaDatum).HasColumnName("sista_datum");
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.ForankradChef).HasColumnName("forankrad_chef");
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.KansligInformation).HasColumnName("kanslig_information");
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.KansligInformationBeskrivning).HasColumnName("kanslig_information_beskrivning");
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.Dataunderlag).HasColumnName("dataunderlag");
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.Dataadministrator).HasColumnName("dataadministrator");
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.Malgrupper).HasColumnName("malgrupper");
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.NyttjandeInterntExternt).HasColumnName("nyttjande_internt_externt");
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.Leverans).HasColumnName("leverans");
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.LeveransArbetstimmar).HasColumnName("leverans_arbetstimmar");
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.Kategori).HasColumnName("kategori");
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.KategoriTyp).HasColumnName("kategori_typ");
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.Prioritet).HasColumnName("prioritet");
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.AntagenJaNej).HasColumnName("antagen_ja_nej");
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.AntagenJaNejMotivering).HasColumnName("antagen_ja_nej_motivering");
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.Handlaggare).HasColumnName("handlaggare");
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.Tabell).HasColumnName("tabell");
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.Wms).HasColumnName("wms");
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.Fme).HasColumnName("fme");
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.Redigering).HasColumnName("redigering");
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.Kopiering).HasColumnName("kopiering");
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.Information).HasColumnName("information");
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.VerksamhetsKritiskData).HasColumnName("verksamhetskritisk_data");
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.Kommentar).HasColumnName("kommentar");
        modelBuilder.Entity<OrderSummary>()
            .Property(x => x.Levererad).HasColumnName("levererad");

        // Configure Metadata entity
        modelBuilder.Entity<Metadata>()
            .ToTable("metadata", "idebank")
            .HasKey(x => x.Gid);
        modelBuilder.Entity<Metadata>()
            .Property(x => x.Gid).HasColumnName("gid");
        modelBuilder.Entity<Metadata>()
            .Property(x => x.SakerhetsKlassDokument).HasColumnName("sakerhetsklass_dokument");
        modelBuilder.Entity<Metadata>()
            .Property(x => x.ArendeNummer).HasColumnName("arendenummer");
        modelBuilder.Entity<Metadata>()
            .Property(x => x.BestallareNamn).HasColumnName("bestallare_namn");
        modelBuilder.Entity<Metadata>()
            .Property(x => x.BestallareEpost).HasColumnName("bestallare_epost");
        modelBuilder.Entity<Metadata>()
            .Property(x => x.SakerhetsKlass).HasColumnName("sakerhetsklass");
        modelBuilder.Entity<Metadata>()
            .Property(x => x.DataKallaTyp).HasColumnName("datakalla_typ");
        modelBuilder.Entity<Metadata>()
            .Property(x => x.Schema).HasColumnName("schema");
        modelBuilder.Entity<Metadata>()
            .Property(x => x.Name).HasColumnName("name");
        modelBuilder.Entity<Metadata>()
            .Property(x => x.Beskrivning).HasColumnName("beskrivning");
        modelBuilder.Entity<Metadata>()
            .Property(x => x.Syfte).HasColumnName("syfte");
        modelBuilder.Entity<Metadata>()
            .Property(x => x.Datakalla).HasColumnName("datakalla");
        modelBuilder.Entity<Metadata>()
            .Property(x => x.Metod).HasColumnName("metod");
        modelBuilder.Entity<Metadata>()
            .Property(x => x.Projekt).HasColumnName("projekt");
        modelBuilder.Entity<Metadata>()
            .Property(x => x.GeografiskBegransning).HasColumnName("geografisk_begransning");
        modelBuilder.Entity<Metadata>()
            .Property(x => x.UppdateringsFrekvens).HasColumnName("uppdateringsfrekvens");
        modelBuilder.Entity<Metadata>()
            .Property(x => x.Fullstandighet).HasColumnName("fullstandighet");
        modelBuilder.Entity<Metadata>()
            .Property(x => x.Skalnivå).HasColumnName("skalniva");
        modelBuilder.Entity<Metadata>()
            .Property(x => x.NyckelOrd).HasColumnName("nyckelord");
        modelBuilder.Entity<Metadata>()
            .Property(x => x.Kategori).HasColumnName("kategori");
        modelBuilder.Entity<Metadata>()
            .Property(x => x.Tidsperiod).HasColumnName("tidsperiod");
        modelBuilder.Entity<Metadata>()
            .Property(x => x.TidsperiodStartdatum).HasColumnName("tidsperiod_startdatum");
        modelBuilder.Entity<Metadata>()
            .Property(x => x.TidsperiodSlutdatum).HasColumnName("tidsperiod_slutdatum");
        modelBuilder.Entity<Metadata>()
            .Property(x => x.TidsUpplosning).HasColumnName("tidsupplosning");
        modelBuilder.Entity<Metadata>()
            .Property(x => x.SkapelseDatum).HasColumnName("skapelsedatum");
        modelBuilder.Entity<Metadata>()
            .Property(x => x.AnvandarBegransningLicens).HasColumnName("anvandarbegransning_licens");
        modelBuilder.Entity<Metadata>()
            .Property(x => x.AnvandarBegransningLicensText).HasColumnName("anvandarbegransning_licens_text");
        modelBuilder.Entity<Metadata>()
            .Property(x => x.RelateradeResurser).HasColumnName("relaterade_resurser");
        modelBuilder.Entity<Metadata>()
            .Property(x => x.Status).HasColumnName("status");
        modelBuilder.Entity<Metadata>()
            .Property(x => x.Handlaggare).HasColumnName("handlaggare");
        modelBuilder.Entity<Metadata>()
            .Property(x => x.MetaDataVersion).HasColumnName("metadata_version");
        modelBuilder.Entity<Metadata>()
            .Property(x => x.SkapadTidPunkt).HasColumnName("skapad_tidpunkt");

        // Configure ManagementPlan entity
        modelBuilder.Entity<ManagementPlan>()
            .ToTable("forvaltningsplan", "idebank")
            .HasKey(x => x.Gid);
        modelBuilder.Entity<ManagementPlan>()
            .Property(x => x.Gid).HasColumnName("gid");
        modelBuilder.Entity<ManagementPlan>()
            .Property(x => x.ArendeNummer).HasColumnName("arende_nummer");
        modelBuilder.Entity<ManagementPlan>()
            .Property(x => x.BestallareNamn).HasColumnName("bestallare_namn");
        modelBuilder.Entity<ManagementPlan>()
            .Property(x => x.BestallareEpost).HasColumnName("bestallare_epost");
        modelBuilder.Entity<ManagementPlan>()
            .Property(x => x.Sakerhetsklass).HasColumnName("sakerhetsklass");
        modelBuilder.Entity<ManagementPlan>()
            .Property(x => x.DatakallaTyp).HasColumnName("datakalla_typ");
        modelBuilder.Entity<ManagementPlan>()
            .Property(x => x.Schema).HasColumnName("schema");
        modelBuilder.Entity<ManagementPlan>()
            .Property(x => x.Namn).HasColumnName("namn");
        modelBuilder.Entity<ManagementPlan>()
            .Property(x => x.Titel).HasColumnName("titel");
        modelBuilder.Entity<ManagementPlan>()
            .Property(x => x.DataAgare).HasColumnName("dataagare");
        modelBuilder.Entity<ManagementPlan>()
            .Property(x => x.DataForvaltare).HasColumnName("dataforvaltare");
        modelBuilder.Entity<ManagementPlan>()
            .Property(x => x.DataAdministrator).HasColumnName("dataadministrator");
        modelBuilder.Entity<ManagementPlan>()
            .Property(x => x.DataKonsument).HasColumnName("datakonsument");
        modelBuilder.Entity<ManagementPlan>()
            .Property(x => x.RedigeringsKalla).HasColumnName("redigeringskalla");
        modelBuilder.Entity<ManagementPlan>()
            .Property(x => x.Publicering).HasColumnName("publicering");
        modelBuilder.Entity<ManagementPlan>()
            .Property(x => x.OppnaData).HasColumnName("oppna_data");
        modelBuilder.Entity<ManagementPlan>()
            .Property(x => x.Arkivering).HasColumnName("arkivering");
        modelBuilder.Entity<ManagementPlan>()
            .Property(x => x.ArkiveringTidpunkt).HasColumnName("arkivering_tidpunkt");
        modelBuilder.Entity<ManagementPlan>()
            .Property(x => x.Atkomst).HasColumnName("atkomst");
        modelBuilder.Entity<ManagementPlan>()
            .Property(x => x.Status).HasColumnName("status");
        modelBuilder.Entity<ManagementPlan>()
            .Property(x => x.Handlaggare).HasColumnName("handlaggare");
        modelBuilder.Entity<ManagementPlan>()
            .Property(x => x.ForvaltningsplanVersion).HasColumnName("forvaltningsplan_version");
        modelBuilder.Entity<ManagementPlan>()
            .Property(x => x.SkapadTidPunkt).HasColumnName("skapad_tidpunkt");
    }
}
