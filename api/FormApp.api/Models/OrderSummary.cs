using System.ComponentModel.DataAnnotations;

namespace FormApp.Api.Models;

/// <summary>
/// Read-only model for the bestallningsspecifikation view.
/// </summary>
public class OrderSummary
{
    public required string ArendenummerArtvise { get; set; }

    public string? ArendenummerOpenE { get; set; }

    public string? BestallareEpost { get; set; }

    public string? BestallareOrganisation { get; set; }

    public string? BestallareTjanstetitel { get; set; }

    public DateOnly? DatumInkommet { get; set; }

    public string? Beskrivning { get; set; }

    public string? Nytta { get; set; }

    public string? SistaDatum { get; set; }

    public bool ForankradChef { get; set; }

    public bool KansligInformation { get; set; }

    public string? KansligInformationBeskrivning { get; set; }

    public string? Dataunderlag { get; set; }

    public string? Dataadministrator { get; set; }

    public string? Malgrupper { get; set; }

    public string? NyttjandeInterntExternt { get; set; }

    public string? Leverans { get; set; }

    public string? LeveransArbetstimmar { get; set; }

    public string? Kategori { get; set; }

    public string? KategoriTyp { get; set; }

    public string? Prioritet { get; set; }

    public string? AntagenJaNej { get; set; }

    public string? AntagenJaNejMotivering { get; set; }

    public string? Handlaggare { get; set; }
}
