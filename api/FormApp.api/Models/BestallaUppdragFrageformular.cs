using System.ComponentModel.DataAnnotations;

namespace FormApp.Api.Models;

public class BestallaUppdragFrageformular
{
    public int Gid { get; set; }

    [MaxLength(255)]
    public string? Arendenummer { get; set; }

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

    [MaxLength(255)]
    public string? AntagenJaNejMotivering { get; set; }

    [MaxLength(255)]
    public string? Handlaggare {  get; set; }
}
