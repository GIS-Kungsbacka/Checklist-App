using System.Text.Json;
using FormApp.Api.Models;

namespace FormApp.Api.Data;
// Test data
public class JsonBestallningsspecifikationRepository : IBestallningsspecifikationRepository
{
    private readonly string _jsonFilePath;
    private readonly ILogger<JsonBestallningsspecifikationRepository> _logger;
    private readonly object _lock = new object();

    public JsonBestallningsspecifikationRepository(ILogger<JsonBestallningsspecifikationRepository> logger, IWebHostEnvironment env)
    {
        _logger = logger;
        _jsonFilePath = Path.Combine(env.ContentRootPath, "data", "bestallningsspecifikation.json");

        _logger.LogInformation("JSON Bestallningsspecifikation Repository initialized. File path: {Path}", _jsonFilePath);

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
        var sample = new List<Bestallningsspecifikation>
        {
            new Bestallningsspecifikation
            {
                BestallningGid = 1,
                Arendenummer = "AR-2024-001",
                BestallareOrganisation = "IT-avdelningen",
                BestallareTjanstetitel = "Systemansvarig",
                DatumInkommet = new DateOnly(2024, 3, 15),
                Beskrivning = "Analys av kundregister för segmentering och målgruppsrapporter.",
                Nytta = "Förbättrad målgruppsanpassad kommunikation.",
                SistaDatum = "2024-04-30",
                ForankradChef = true,
                KansligInformation = false,
                FrageformularGid = 1,
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
                AntagenJaNejMotivering = "Projektet är välplanerat och har tillräcklig budget."
            }
        };

        SaveData(sample);
    }

    private List<Bestallningsspecifikation> LoadData()
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
                var data = JsonSerializer.Deserialize<List<Bestallningsspecifikation>>(json, options);
                return data ?? new List<Bestallningsspecifikation>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading bestallningsspecifikation from {Path}", _jsonFilePath);
                try
                {
                    InitializeSampleData();
                    var json = File.ReadAllText(_jsonFilePath);
                    return JsonSerializer.Deserialize<List<Bestallningsspecifikation>>(json,
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<Bestallningsspecifikation>();
                }
                catch
                {
                    return new List<Bestallningsspecifikation>();
                }
            }
        }
    }

    private void SaveData(List<Bestallningsspecifikation> data)
    {
        lock (_lock)
        {
            var json = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_jsonFilePath, json);
        }
    }

    public Task<IEnumerable<Bestallningsspecifikation>> GetAllAsync()
    {
        var data = LoadData();
        return Task.FromResult<IEnumerable<Bestallningsspecifikation>>(data.OrderByDescending(x => x.BestallningGid));
    }

    public Task<Bestallningsspecifikation?> GetByIdAsync(int bestallningGid)
    {
        var data = LoadData();
        return Task.FromResult(data.FirstOrDefault(x => x.BestallningGid == bestallningGid));
    }
}
