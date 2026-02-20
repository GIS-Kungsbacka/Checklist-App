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
                BestallareEpost = "Test@hotmail.com",
                BestallareOrganisation = "IT-avdelningen",
                BestallareTjanstetitel = "Systemansvarig",
                DatumInkommet = new DateOnly(2024, 3, 15),
                Beskrivning = "Analys av kundregister för segmentering och målgruppsrapporter.",
                Nytta = "Förbättrad målgruppsanpassad kommunikation.",
                SistaDatum = "2024-04-30",
                ForankradChef = true,
                KansligInformation = false,
                KansligInformationBeskrivning = "Hemlig1",
                Dataunderlag = "Kundregister och transaktionsdata",
                Dataadministrator = "Anna",
                Malgrupper = "Marknadsföring, Försäljning",
                NyttjandeInterntExternt = "Internt",
                Leverans = "Rapport i PDF-format",
                LeveransArbetstimmar = "40 timmar",
                Kategori = "Dataanalys",
                KategoriTyp = "Standard",
                Prioritet = "Hög",
                AntagenJaNej = "Ja",
                AntagenJaNejMotivering = "Projektet är välplanerat och har tillräcklig budget.",
                Handlaggare = "Test1"
            },
             new OrderSummary
            {
                ArendenummerArtvise = "2026XX2",
                ArendenummerOpenE = "AR-2024-002",
                BestallareEpost = "Test@hotmail.com",
                BestallareOrganisation = "IT-avdelningen",
                BestallareTjanstetitel = "Systemansvarig",
                DatumInkommet = new DateOnly(2024, 3, 15),
                Beskrivning = "Analys av kundregister för segmentering och målgruppsrapporter.",
                Nytta = "Förbättrad målgruppsanpassad kommunikation.",
                SistaDatum = "2024-04-30",
                ForankradChef = true,
                KansligInformation = false,
                KansligInformationBeskrivning = "Hemlig2",
                Dataunderlag = "Kundregister och transaktionsdata",
                Dataadministrator = "Anna",
                Malgrupper = "Marknadsföring, Försäljning",
                NyttjandeInterntExternt = "Internt",
                Leverans = "Rapport i PDF-format",
                LeveransArbetstimmar = "40 timmar",
                Kategori = "Dataanalys",
                KategoriTyp = "Standard",
                Prioritet = "Hög",
                AntagenJaNej = "Ja",
                AntagenJaNejMotivering = "Projektet är välplanerat och har tillräcklig budget.",
                Handlaggare = "Test2"
            },
              new OrderSummary
            {
                ArendenummerArtvise = "2026XX3",
                ArendenummerOpenE = "AR-2024-003",
                BestallareEpost = "Test@hotmail.com",
                BestallareOrganisation = "IT-avdelningen",
                BestallareTjanstetitel = "Systemansvarig",
                DatumInkommet = new DateOnly(2024, 3, 15),
                Beskrivning = "Analys av kundregister för segmentering och målgruppsrapporter.",
                Nytta = "Förbättrad målgruppsanpassad kommunikation.",
                SistaDatum = "2024-04-30",
                ForankradChef = true,
                KansligInformation = false,
                KansligInformationBeskrivning = "Hemlig3",
                Dataunderlag = "Kundregister och transaktionsdata",
                Dataadministrator = "Anna",
                Malgrupper = "Marknadsföring, Försäljning",
                NyttjandeInterntExternt = "Internt",
                Leverans = "Rapport i PDF-format",
                LeveransArbetstimmar = "40 timmar",
                Kategori = "Dataanalys",
                KategoriTyp = "Standard",
                Prioritet = "Hög",
                AntagenJaNej = "Ja",
                AntagenJaNejMotivering = "Projektet är välplanerat och har tillräcklig budget.",
                Handlaggare = "Test3"
            },
               new OrderSummary
            {
                ArendenummerArtvise = "2026XX4",
                ArendenummerOpenE = "AR-2024-004",
                BestallareEpost = "Test@hotmail.com",
                BestallareOrganisation = "IT-avdelningen",
                BestallareTjanstetitel = "Systemansvarig",
                DatumInkommet = new DateOnly(2024, 3, 15),
                Beskrivning = "Analys av kundregister för segmentering och målgruppsrapporter.",
                Nytta = "Förbättrad målgruppsanpassad kommunikation.",
                SistaDatum = "2024-04-30",
                ForankradChef = true,
                KansligInformation = false,
                KansligInformationBeskrivning = "Hemlig4",
                Dataunderlag = "Kundregister och transaktionsdata",
                Dataadministrator = "Anna",
                Malgrupper = "Marknadsföring, Försäljning",
                NyttjandeInterntExternt = "Internt",
                Leverans = "Rapport i PDF-format",
                LeveransArbetstimmar = "40 timmar",
                Kategori = "Dataanalys",
                KategoriTyp = "Standard",
                Prioritet = "Hög",
                AntagenJaNej = "Ja",
                AntagenJaNejMotivering = "Projektet är välplanerat och har tillräcklig budget.",
                Handlaggare = "Test4"
            },
                new OrderSummary
            {
                ArendenummerArtvise = "2026XX5",
                ArendenummerOpenE = "AR-2024-005",
                BestallareEpost = "Test@hotmail.com",
                BestallareOrganisation = "IT-avdelningen",
                BestallareTjanstetitel = "Systemansvarig",
                DatumInkommet = new DateOnly(2024, 3, 15),
                Beskrivning = "Analys av kundregister för segmentering och målgruppsrapporter.",
                Nytta = "Förbättrad målgruppsanpassad kommunikation.",
                SistaDatum = "2024-04-30",
                ForankradChef = true,
                KansligInformation = false,
                KansligInformationBeskrivning = "Hemlig5",
                Dataunderlag = "Kundregister och transaktionsdata",
                Dataadministrator = "Anna",
                Malgrupper = "Marknadsföring, Försäljning",
                NyttjandeInterntExternt = "Internt",
                Leverans = "Rapport i PDF-format",
                LeveransArbetstimmar = "40 timmar",
                Kategori = "Dataanalys",
                KategoriTyp = "Standard",
                Prioritet = "Hög",
                AntagenJaNej = "Ja",
                AntagenJaNejMotivering = "Projektet är välplanerat och har tillräcklig budget.",
                Handlaggare = "Test5"
            }
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
