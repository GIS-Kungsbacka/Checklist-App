using System.Text.Json;
using FormApp.Api.Models;

namespace FormApp.Api.Data;
// Test data
public class JsonOrderSummaryRepository : IOrderSummaryRepository
{
    private readonly string _jsonFilePath;
    private readonly ILogger<JsonOrderSummaryRepository> _logger;
    private readonly object _lock = new object();

    public JsonOrderSummaryRepository(ILogger<JsonOrderSummaryRepository> logger, IWebHostEnvironment env)
    {
        _logger = logger;
        _jsonFilePath = Path.Combine(env.ContentRootPath, "data", "orderSummary.json");

        _logger.LogInformation("JSON OrderSummary Repository initialized. File path: {Path}", _jsonFilePath);

        var directory = Path.GetDirectoryName(_jsonFilePath);
        if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
        {
            Directory.CreateDirectory(directory);
        }

        if (!File.Exists(_jsonFilePath))
        {
            _logger.LogInformation("JSON file not found, initializing with one sample record");
            InitializeSampleData();
        }
    }

    private void InitializeSampleData()
    {
        var sample = new List<OrderSummary>
        {
            new OrderSummary
            {
                ArendenummerArtvise = "2026XX1",
                ArendenummerOpenE = "AR-2024-001",
                BestallareEpost = "elin.andersson@stad.se",
                BestallareOrganisation = "Utbildningsforvaltningen",
                BestallareTjanstetitel = "Verksamhetsutvecklare",
                DatumInkommet = new DateOnly(2024, 1, 15),
                Beskrivning = "Uppfoljning av gymnasieelevers narvaro och avbrott for att tidigt hitta riskgrupper.",
                Nytta = "Battre riktade insatser och minskat antal avhopp.",
                SistaDatum = "2024-05-31",
                ForankradChef = true,
                KansligInformation = true,
                KansligInformationBeskrivning = "Personuppgifter om elever, krav pa avidentifiering.",
                Dataunderlag = "Skolregister, franvarorapporter",
                Dataadministrator = "Anna",
                Malgrupper = "Skolledning, Elevhalsa",
                NyttjandeInterntExternt = "Internt",
                Leverans = "Interaktiv dashboard i Power BI",
                LeveransArbetstimmar = "55 timmar",
                Kategori = "Utbildningsanalys",
                KategoriTyp = "Avancerad",
                Prioritet = "Hög",
                AntagenJaNej = "Ja",
                AntagenJaNejMotivering = "Hog verksamhetsnytta och tydlig bestallning.",
                Handlaggare = "Test1"
            },
            new OrderSummary
            {
                ArendenummerArtvise = "2026XX2",
                ArendenummerOpenE = "AR-2024-002",
                BestallareEpost = "johan.nilsson@region.se",
                BestallareOrganisation = "Halso- och sjukvardsstaben",
                BestallareTjanstetitel = "Controller",
                DatumInkommet = new DateOnly(2024, 2, 3),
                Beskrivning = "Analys av vantetider per vardcentral och besokstyp.",
                Nytta = "Underlag for resursfordelning och kortare koer.",
                SistaDatum = "2024-06-14",
                ForankradChef = true,
                KansligInformation = true,
                KansligInformationBeskrivning = "Patientnara data, aggregering kravs.",
                Dataunderlag = "Vardproduktionssystem, bokningsdata",
                Dataadministrator = "Erik",
                Malgrupper = "Ledningsgrupp, Verksamhetschefer",
                NyttjandeInterntExternt = "Internt",
                Leverans = "Manadsrapport och KPI-paket",
                LeveransArbetstimmar = "62 timmar",
                Kategori = "Vardanalys",
                KategoriTyp = "Komplex",
                Prioritet = "Hög",
                AntagenJaNej = "Ja",
                AntagenJaNejMotivering = "Kopplad till strategiskt mal for vardtillganglighet.",
                Handlaggare = "Test2"
            },
            new OrderSummary
            {
                ArendenummerArtvise = "2026XX3",
                ArendenummerOpenE = "AR-2024-003",
                BestallareEpost = "sara.lind@stad.se",
                BestallareOrganisation = "Tekniska kontoret",
                BestallareTjanstetitel = "Projektledare",
                DatumInkommet = new DateOnly(2024, 2, 21),
                Beskrivning = "Utvardering av snorojningsinsatser baserat pa larm och utforda atgarder.",
                Nytta = "Effektivare vinterberedskap och battre medborgarservice.",
                SistaDatum = "2024-07-01",
                ForankradChef = true,
                KansligInformation = false,
                KansligInformationBeskrivning = "",
                Dataunderlag = "Arendehantering, entreprenorsloggar",
                Dataadministrator = "Anna",
                Malgrupper = "Gatuenhet, Driftledning",
                NyttjandeInterntExternt = "Internt",
                Leverans = "Karta med handelser och veckorapport",
                LeveransArbetstimmar = "38 timmar",
                Kategori = "Driftuppfoljning",
                KategoriTyp = "Standard",
                Prioritet = "Medel",
                AntagenJaNej = "Ja",
                AntagenJaNejMotivering = "Begransat scope och snabb leveransmojlighet.",
                Handlaggare = "Test3"
            },
            new OrderSummary
            {
                ArendenummerArtvise = "2026XX4",
                ArendenummerOpenE = "AR-2024-004",
                BestallareEpost = "fatima.hassan@myndighet.se",
                BestallareOrganisation = "Arbetsmarknadsenheten",
                BestallareTjanstetitel = "Enhetschef",
                DatumInkommet = new DateOnly(2024, 3, 10),
                Beskrivning = "Kartlaggning av deltagarfloden i arbetsmarknadsinsatser.",
                Nytta = "Battre uppfoljning av effekter och genomstromning.",
                SistaDatum = "2024-06-30",
                ForankradChef = true,
                KansligInformation = true,
                KansligInformationBeskrivning = "Individuppgifter om deltagare, pseudonymisering behovs.",
                Dataunderlag = "Insatsregister, uppfoljningsenkater",
                Dataadministrator = "Lars",
                Malgrupper = "Arbetsmarknadschef, Analysfunktion",
                NyttjandeInterntExternt = "Internt",
                Leverans = "Resultatrapport och presentationsunderlag",
                LeveransArbetstimmar = "44 timmar",
                Kategori = "Effektanalys",
                KategoriTyp = "Standard",
                Prioritet = "Medel",
                AntagenJaNej = "Ja",
                AntagenJaNejMotivering = "Datatillgang och ansvarsfordelning ar tydlig.",
                Handlaggare = "Test4"
            },
            new OrderSummary
            {
                ArendenummerArtvise = "2026XX5",
                ArendenummerOpenE = "AR-2024-005",
                BestallareEpost = "martin.ek@bolag.se",
                BestallareOrganisation = "Fastighetsforvaltningen",
                BestallareTjanstetitel = "Forvaltningsstrateg",
                DatumInkommet = new DateOnly(2024, 3, 22),
                Beskrivning = "Energiuppfoljning av kommunala fastigheter per objekt och manad.",
                Nytta = "Identifiera besparingspotential och minska energikostnader.",
                SistaDatum = "2024-08-15",
                ForankradChef = true,
                KansligInformation = false,
                KansligInformationBeskrivning = "",
                Dataunderlag = "Elmatare, fjarrvarmedata",
                Dataadministrator = "Anna",
                Malgrupper = "Fastighetscontroller, Drifttekniker",
                NyttjandeInterntExternt = "Internt",
                Leverans = "Automatiserat manadsutskick och dashboard",
                LeveransArbetstimmar = "47 timmar",
                Kategori = "Energianalys",
                KategoriTyp = "Standard",
                Prioritet = "Låg",
                AntagenJaNej = "Ja",
                AntagenJaNejMotivering = "Bra forbattringspotential men ej akut.",
                Handlaggare = "Test5"
            },
            new OrderSummary
            {
                ArendenummerArtvise = "2026XX6",
                ArendenummerOpenE = "AR-2024-006",
                BestallareEpost = "linda.sjostrom@stad.se",
                BestallareOrganisation = "Kultur- och fritidsforvaltningen",
                BestallareTjanstetitel = "Verksamhetscontroller",
                DatumInkommet = new DateOnly(2024, 4, 5),
                Beskrivning = "Analys av besoksmonsster i bibliotek och fritidsanlaggningar.",
                Nytta = "Forbattrad schemalaggning och resursanvandning.",
                SistaDatum = "2024-09-01",
                ForankradChef = false,
                KansligInformation = false,
                KansligInformationBeskrivning = "",
                Dataunderlag = "Passersystem, bokningsdata",
                Dataadministrator = "Erik",
                Malgrupper = "Platschefer, Forvaltningsledning",
                NyttjandeInterntExternt = "Internt",
                Leverans = "Kvartalsvis uppfoljningsrapport",
                LeveransArbetstimmar = "26 timmar",
                Kategori = "Besoksanalys",
                KategoriTyp = "Standard",
                Prioritet = "Låg",
                AntagenJaNej = "Nej",
                AntagenJaNejMotivering = "Bestallningen behover forankras hos chef innan start.",
                Handlaggare = ""
            },
            new OrderSummary
            {
                ArendenummerArtvise = "2026XX7",
                ArendenummerOpenE = "AR-2024-007",
                BestallareEpost = "olof.gran@kommun.se",
                BestallareOrganisation = "Socialforvaltningen",
                BestallareTjanstetitel = "Kvalitetsutvecklare",
                DatumInkommet = new DateOnly(2024, 4, 19),
                Beskrivning = "Jamforelse av handlaggningstider mellan olika enheter.",
                Nytta = "Minskade ledtider och mer jamlik handlaggning.",
                SistaDatum = "2024-10-15",
                ForankradChef = true,
                KansligInformation = true,
                KansligInformationBeskrivning = "Innehaller individdata, endast aggregerad redovisning.",
                Dataunderlag = "Verksamhetssystem, arendeloggar",
                Dataadministrator = "Maria",
                Malgrupper = "Enhetschefer, Kvalitetsrad",
                NyttjandeInterntExternt = "Internt",
                Leverans = "Analys-PM och forbattringsforslag",
                LeveransArbetstimmar = "52 timmar",
                Kategori = "Processanalys",
                KategoriTyp = "Komplex",
                Prioritet = "Hög",
                AntagenJaNej = "Ja",
                AntagenJaNejMotivering = "Kritisk fraga i verksamhetsplanen.",
                Handlaggare = "Test6"
            },
            new OrderSummary
            {
                ArendenummerArtvise = "2026XX8",
                ArendenummerOpenE = "AR-2024-008",
                BestallareEpost = "frida.karlsson@region.se",
                BestallareOrganisation = "Kollektivtrafikstaben",
                BestallareTjanstetitel = "Trafikplanerare",
                DatumInkommet = new DateOnly(2024, 5, 2),
                Beskrivning = "Belaggningsanalys av busslinjer under rusningstid.",
                Nytta = "Battre turtathet och mindre trangsel.",
                SistaDatum = "2024-10-31",
                ForankradChef = true,
                KansligInformation = false,
                KansligInformationBeskrivning = "",
                Dataunderlag = "Biljettdata, sensordata fran fordon",
                Dataadministrator = "Lars",
                Malgrupper = "Trafikledning, Planeringsgrupp",
                NyttjandeInterntExternt = "Externt",
                Leverans = "Scenariorapport med kapacitetsforslag",
                LeveransArbetstimmar = "58 timmar",
                Kategori = "Transportanalys",
                KategoriTyp = "Avancerad",
                Prioritet = "Medel",
                AntagenJaNej = "Ja",
                AntagenJaNejMotivering = "Underlag behovs infor tidtabellsskifte.",
                Handlaggare = "Test7"
            },
            new OrderSummary
            {
                ArendenummerArtvise = "2026XX9",
                ArendenummerOpenE = "AR-2024-009",
                BestallareEpost = "henrik.berg@stad.se",
                BestallareOrganisation = "Kommunledningskontoret",
                BestallareTjanstetitel = "Digitaliseringschef",
                DatumInkommet = new DateOnly(2024, 5, 20),
                Beskrivning = "Mognadsmatning av digitala tjanster och anvandningsgrad per forvaltning.",
                Nytta = "Prioritering av utvecklingsinsatser i digitaliseringsportfoljen.",
                SistaDatum = "2024-11-29",
                ForankradChef = true,
                KansligInformation = false,
                KansligInformationBeskrivning = "",
                Dataunderlag = "Webbanalys, e-tjansteplattform",
                Dataadministrator = "Anna",
                Malgrupper = "Styrgrupp digitalisering",
                NyttjandeInterntExternt = "Internt",
                Leverans = "Benchmark-rapport och prioriteringslista",
                LeveransArbetstimmar = "41 timmar",
                Kategori = "Digitaliseringsuppfoljning",
                KategoriTyp = "Standard",
                Prioritet = "Medel",
                AntagenJaNej = "Ja",
                AntagenJaNejMotivering = "Lag teknisk risk och tydlig bestallning.",
                Handlaggare = "Test8"
            },
            new OrderSummary
            {
                ArendenummerArtvise = "2026XX10",
                ArendenummerOpenE = "AR-2024-010",
                BestallareEpost = "nadeem.ali@myndighet.se",
                BestallareOrganisation = "Miljoforvaltningen",
                BestallareTjanstetitel = "Miljoinspektor",
                DatumInkommet = new DateOnly(2024, 6, 7),
                Beskrivning = "Oversikt av anmalda miljoarenden och handlaggningsstatus.",
                Nytta = "Snabbare uppfoljning och battre planering av tillsyn.",
                SistaDatum = "2024-12-10",
                ForankradChef = false,
                KansligInformation = false,
                KansligInformationBeskrivning = "",
                Dataunderlag = "Arendesystem, tillsynsregister",
                Dataadministrator = "Erik",
                Malgrupper = "Miljoenheten",
                NyttjandeInterntExternt = "Internt",
                Leverans = "Veckovis statusrapport",
                LeveransArbetstimmar = "24 timmar",
                Kategori = "Tillsynsuppfoljning",
                KategoriTyp = "Standard",
                Prioritet = "Låg",
                AntagenJaNej = "Nej",
                AntagenJaNejMotivering = "Behov av komplettering av datakvalitet innan start.",
                Handlaggare = ""
            },
            new OrderSummary
            {
                ArendenummerArtvise = "2026XX11",
                ArendenummerOpenE = "AR-2024-011",
                BestallareEpost = "karin.palm@stad.se",
                BestallareOrganisation = "HR-avdelningen",
                BestallareTjanstetitel = "HR-analytiker",
                DatumInkommet = new DateOnly(2024, 6, 18),
                Beskrivning = "Analys av sjukfranvaro per verksamhetsomrade och sasong.",
                Nytta = "Tidiga insatser for arbetsmiljo och minskad franvaro.",
                SistaDatum = "2024-12-20",
                ForankradChef = true,
                KansligInformation = true,
                KansligInformationBeskrivning = "Personuppgifter i HR-data, krav pa strikt behorighet.",
                Dataunderlag = "HR-system, schemadata",
                Dataadministrator = "Maria",
                Malgrupper = "HR-chef, Enhetschefer",
                NyttjandeInterntExternt = "Internt",
                Leverans = "Manadsdashboard med atgardsindikatorer",
                LeveransArbetstimmar = "49 timmar",
                Kategori = "HR-analys",
                KategoriTyp = "Komplex",
                Prioritet = "Hög",
                AntagenJaNej = "Ja",
                AntagenJaNejMotivering = "Prioriterad i arbetsmiljoplanen.",
                Handlaggare = "Test9"
            },
        };

        SaveData(sample);
    }

    private List<OrderSummary> LoadData()
    {
        lock (_lock)
        {
            if (!File.Exists(_jsonFilePath))
            {
                InitializeSampleData();
            }

            try
            {
                var json = File.ReadAllText(_jsonFilePath);
                if (string.IsNullOrWhiteSpace(json))
                {
                    InitializeSampleData();
                    json = File.ReadAllText(_jsonFilePath);
                }

                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var data = JsonSerializer.Deserialize<List<OrderSummary>>(json, options);
                return data ?? new List<OrderSummary>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading order summary from {Path}", _jsonFilePath);
                try
                {
                    InitializeSampleData();
                    var json = File.ReadAllText(_jsonFilePath);
                    return JsonSerializer.Deserialize<List<OrderSummary>>(json,
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<OrderSummary>();
                }
                catch
                {
                    return new List<OrderSummary>();
                }
            }
        }
    }

    private void SaveData(List<OrderSummary> data)
    {
        lock (_lock)
        {
            var json = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_jsonFilePath, json);
        }
    }

    public Task<IEnumerable<OrderSummary>> GetAllAsync()
    {
        var data = LoadData();
        return Task.FromResult<IEnumerable<OrderSummary>>(data.OrderByDescending(x => x.ArendenummerArtvise));
    }

    public Task<OrderSummary?> GetByIdAsync(string arendenummerArtvise)
    {
        var data = LoadData();
        return Task.FromResult(data.FirstOrDefault(x => x.ArendenummerArtvise == arendenummerArtvise));
    }
}
