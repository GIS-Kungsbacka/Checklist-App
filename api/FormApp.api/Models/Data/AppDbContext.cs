using FormApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FormApp.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

  
    public DbSet<BestallaUppdragFrageformular> BestallaUppdragFrageformulars => Set<BestallaUppdragFrageformular>();
    public DbSet<Bestallningsspecifikation> Bestallningsspecifikationer => Set<Bestallningsspecifikation>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        
        
        // Configure BestallaUppdragFrageformular entity
        modelBuilder.Entity<BestallaUppdragFrageformular>()
            .ToTable("bestalla_uppdrag_frageformular")
            .HasKey(x => x.Gid);
        
        // Map property names to database column names (snake_case to PascalCase)
        modelBuilder.Entity<BestallaUppdragFrageformular>()
            .Property(x => x.Gid)
            .HasColumnName("gid");
        modelBuilder.Entity<BestallaUppdragFrageformular>()
            .Property(x => x.Arendernummer)
            .HasColumnName("arendernummer");
        modelBuilder.Entity<BestallaUppdragFrageformular>()
            .Property(x => x.Dataunderlag)
            .HasColumnName("dataunderlag");
        modelBuilder.Entity<BestallaUppdragFrageformular>()
            .Property(x => x.Dataadministrator)
            .HasColumnName("dataadministrator");
        modelBuilder.Entity<BestallaUppdragFrageformular>()
            .Property(x => x.Malgrupper)
            .HasColumnName("malgrupper");
        modelBuilder.Entity<BestallaUppdragFrageformular>()
            .Property(x => x.NyttjandeInterntExternt)
            .HasColumnName("nyttjande_internt_externt");
        modelBuilder.Entity<BestallaUppdragFrageformular>()
            .Property(x => x.Leverans)
            .HasColumnName("leverans");
        modelBuilder.Entity<BestallaUppdragFrageformular>()
            .Property(x => x.LeveransArbetstimmar)
            .HasColumnName("leverans_arbetstimmar");
        modelBuilder.Entity<BestallaUppdragFrageformular>()
            .Property(x => x.Kategori)
            .HasColumnName("kategori");
        modelBuilder.Entity<BestallaUppdragFrageformular>()
            .Property(x => x.KategoriTyp)
            .HasColumnName("kategori_typ");
        modelBuilder.Entity<BestallaUppdragFrageformular>()
            .Property(x => x.Parioritet)
            .HasColumnName("parioritet");
        modelBuilder.Entity<BestallaUppdragFrageformular>()
            .Property(x => x.AntagenJaNej)
            .HasColumnName("antagen_ja_nej");
        modelBuilder.Entity<BestallaUppdragFrageformular>()
            .Property(x => x.AntagenJaNejMotivering)
            .HasColumnName("antagen_ja_nej_motivering");

        // Read-only view: bestallningsspecifikation
        modelBuilder.Entity<Bestallningsspecifikation>()
            .ToView("bestallningsspecifikation")
            .HasKey(x => x.BestallningGid);
        modelBuilder.Entity<Bestallningsspecifikation>()
            .Property(x => x.BestallningGid).HasColumnName("bestallning_gid");
        modelBuilder.Entity<Bestallningsspecifikation>()
            .Property(x => x.Arendenummer).HasColumnName("arendenummer");
        modelBuilder.Entity<Bestallningsspecifikation>()
            .Property(x => x.BestallareOrganisation).HasColumnName("bestallare_organisation");
        modelBuilder.Entity<Bestallningsspecifikation>()
            .Property(x => x.BestallareTjanstetitel).HasColumnName("bestallare_tjanstetitel");
        modelBuilder.Entity<Bestallningsspecifikation>()
            .Property(x => x.DatumInkommet).HasColumnName("datum_inkommet");
        modelBuilder.Entity<Bestallningsspecifikation>()
            .Property(x => x.Beskrivning).HasColumnName("beskrivning");
        modelBuilder.Entity<Bestallningsspecifikation>()
            .Property(x => x.Nytta).HasColumnName("nytta");
        modelBuilder.Entity<Bestallningsspecifikation>()
            .Property(x => x.SistaDatum).HasColumnName("sista_datum");
        modelBuilder.Entity<Bestallningsspecifikation>()
            .Property(x => x.ForankradChef).HasColumnName("forankrad_chef");
        modelBuilder.Entity<Bestallningsspecifikation>()
            .Property(x => x.KansligInformation).HasColumnName("kanslig_information");
        modelBuilder.Entity<Bestallningsspecifikation>()
            .Property(x => x.FrageformularGid).HasColumnName("frageformular_gid");
        modelBuilder.Entity<Bestallningsspecifikation>()
            .Property(x => x.Dataunderlag).HasColumnName("dataunderlag");
        modelBuilder.Entity<Bestallningsspecifikation>()
            .Property(x => x.Dataadministrator).HasColumnName("dataadministrator");
        modelBuilder.Entity<Bestallningsspecifikation>()
            .Property(x => x.Malgrupper).HasColumnName("malgrupper");
        modelBuilder.Entity<Bestallningsspecifikation>()
            .Property(x => x.NyttjandeInterntExternt).HasColumnName("nyttjande_internt_externt");
        modelBuilder.Entity<Bestallningsspecifikation>()
            .Property(x => x.Leverans).HasColumnName("leverans");
        modelBuilder.Entity<Bestallningsspecifikation>()
            .Property(x => x.LeveransArbetstimmar).HasColumnName("leverans_arbetstimmar");
        modelBuilder.Entity<Bestallningsspecifikation>()
            .Property(x => x.Kategori).HasColumnName("kategori");
        modelBuilder.Entity<Bestallningsspecifikation>()
            .Property(x => x.KategoriTyp).HasColumnName("kategori_typ");
        modelBuilder.Entity<Bestallningsspecifikation>()
            .Property(x => x.Prioritet).HasColumnName("prioritet");
        modelBuilder.Entity<Bestallningsspecifikation>()
            .Property(x => x.AntagenJaNej).HasColumnName("antagen_ja_nej");
        modelBuilder.Entity<Bestallningsspecifikation>()
            .Property(x => x.AntagenJaNejMotivering).HasColumnName("antagen_ja_nej_motivering");
    }
}
