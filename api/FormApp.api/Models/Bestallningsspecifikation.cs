using System.ComponentModel.DataAnnotations;

namespace FormApp.Api.Models;

/// <summary>
/// Read-only model for the bestallningsspecifikation view.
/// </summary>
public class Bestallningsspecifikation
{
    public int BestallningGid { get; set; }

    [MaxLength(255)]
    public string? Arendenummer { get; set; }

    [MaxLength(255)]
    public string? BestallareOrganisation { get; set; }

    [MaxLength(255)]
    public string? BestallareTjanstetitel { get; set; }

    public DateOnly? DatumInkommet { get; set; }

    [MaxLength(2000)]
    public string? Beskrivning { get; set; }

    [MaxLength(2000)]
    public string? Nytta { get; set; }

    [MaxLength(255)]
    public string? SistaDatum { get; set; }

    public bool ForankradChef { get; set; }

    public bool KansligInformation { get; set; }

    public int? FrageformularGid { get; set; }

    [MaxLength(255)]
    public string? Dataunderlag { get; set; }

    [MaxLength(255)]
    public string? Dataadministrator { get; set; }

    [MaxLength(255)]
    public string? Malgrupper { get; set; }

    [MaxLength(255)]
    public string? NyttjandeInterntExternt { get; set; }

    [MaxLength(255)]
    public string? Leverans { get; set; }

    [MaxLength(255)]
    public string? LeveransArbetstimmar { get; set; }

    [MaxLength(255)]
    public string? Kategori { get; set; }

    [MaxLength(255)]
    public string? KategoriTyp { get; set; }

    [MaxLength(255)]
    public string? Prioritet { get; set; }

    [MaxLength(255)]
    public string? AntagenJaNej { get; set; }

    [MaxLength(2000)]
    public string? AntagenJaNejMotivering { get; set; }
}
