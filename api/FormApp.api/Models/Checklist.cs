using System.ComponentModel.DataAnnotations;

namespace FormApp.Api.Models;

public class Checklist
{
    public int Gid { get; set; }

    public required string ArendenummerArtvise { get; set; }

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

    public string? Handlaggare {  get; set; }

    public string? Tabell { get; set; }

    public string? Wms { get; set; }

    public string? Fme { get; set; }

    public string? Redigering { get; set; }

    public bool? Kopiering { get; set; }

    public string? Information { get; set; }

    public string? Kommentar { get; set; }

    public string? VerksamhetsKritiskData { get; set; }

    public bool? Levererad { get; set; }
}
