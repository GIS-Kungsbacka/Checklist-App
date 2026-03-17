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
    }
}
