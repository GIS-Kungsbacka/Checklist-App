using System.Text.Json;
using FormApp.Api.Models;

namespace FormApp.Api.Data;
// Test data
public class JsonBestallaUppdragFrageformularRepository : IBestallaUppdragFrageformularRepository
{
    private readonly string _jsonFilePath;
    private readonly ILogger<JsonBestallaUppdragFrageformularRepository> _logger;
    private readonly object _lock = new object();

    public JsonBestallaUppdragFrageformularRepository(ILogger<JsonBestallaUppdragFrageformularRepository> logger, IWebHostEnvironment env)
    {
        _logger = logger;
        // Store JSON file in the API folder
        _jsonFilePath = Path.Combine(env.ContentRootPath, "data", "bestalla_uppdrag_frageformular.json");
        
        _logger.LogInformation("JSON Bestalla Uppdrag Frageformular Repository initialized. File path: {Path}", _jsonFilePath);
        
        // Ensure directory exists
        var directory = Path.GetDirectoryName(_jsonFilePath);
        if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
        {
            Directory.CreateDirectory(directory);
            _logger.LogInformation("Created data directory: {Directory}", directory);
        }
        
        // Initialize with sample data if file doesn't exist
        if (!File.Exists(_jsonFilePath))
        {
            _logger.LogInformation("JSON file not found, initializing with sample data");
            InitializeSampleData();
        }
        else
        {
            _logger.LogInformation("JSON file found at {Path}", _jsonFilePath);
        }
    }

    private void InitializeSampleData()
    {
        var sampleData = new List<BestallaUppdragFrageformular>
        {
            new BestallaUppdragFrageformular
            {
                Gid = 1,
                Arendernummer = "AR-2024-001",
                Dataunderlag = "Kundregister och transaktionsdata",
                Dataadministrator = "Anna",
                Malgrupper = "Marknadsföring, Försäljning",
                NyttjandeInterntExternt = "Internt",
                Leverans = "Rapport i PDF-format",
                LeveransArbetstimmar = "40 timmar",
                Kategori = "Dataanalys",
                KategoriTyp = "Standard",
                Parioritet = "Hög",
                AntagenJaNej = "Ja",
                AntagenJaNejMotivering = "Projektet är välplanerat och har tillräcklig budget"
            },
            new BestallaUppdragFrageformular
            {
                Gid = 2,
                Arendernummer = "AR-2024-002",
                Dataunderlag = "Produktkatalog och lagerdata",
                Dataadministrator = "Erik",
                Malgrupper = "Logistik, Lager",
                NyttjandeInterntExternt = "Externt",
                Leverans = "API-integration",
                LeveransArbetstimmar = "60 timmar",
                Kategori = "Systemintegration",
                KategoriTyp = "Komplex",
                Parioritet = "Medel",
                AntagenJaNej = "Ja",
                AntagenJaNejMotivering = "Godkänd efter teknisk granskning"
            },
            new BestallaUppdragFrageformular
            {
                Gid = 3,
                Arendernummer = "AR-2024-003",
                Dataunderlag = "Användardata och beteendeanalys",
                Dataadministrator = "Maria",
                Malgrupper = "IT, Utveckling",
                NyttjandeInterntExternt = "Internt",
                Leverans = "Dashboard och visualiseringar",
                LeveransArbetstimmar = "80 timmar",
                Kategori = "Business Intelligence",
                KategoriTyp = "Avancerad",
                Parioritet = "Hög",
                AntagenJaNej = "Nej",
                AntagenJaNejMotivering = "Projektet kräver ytterligare resurser som inte finns tillgängliga"
            },
            new BestallaUppdragFrageformular
            {
                Gid = 4,
                Arendernummer = "AR-2024-004",
                Dataunderlag = "Ekonomiska rapporter och budgetdata",
                Dataadministrator = "Lars",
                Malgrupper = "Ekonomi, Ledning",
                NyttjandeInterntExternt = "Internt",
                Leverans = "Excel-rapporter och PowerPoint-presentationer",
                LeveransArbetstimmar = "20 timmar",
                Kategori = "Rapportering",
                KategoriTyp = "Standard",
                Parioritet = "Låg",
                AntagenJaNej = "Ja",
                AntagenJaNejMotivering = "Rutinuppdrag som kan genomföras snabbt"
            },
            new BestallaUppdragFrageformular
            {
                Gid = 5,
                Arendernummer = "AR-2024-005",
                Dataunderlag = "Kundfeedback och nöjdhetsundersökningar",
                Dataadministrator = "Sara",
                Malgrupper = "Kundservice, Marknadsföring",
                NyttjandeInterntExternt = "Externt",
                Leverans = "Analysrapport med rekommendationer",
                LeveransArbetstimmar = "30 timmar",
                Kategori = "Kundanalys",
                KategoriTyp = "Standard",
                Parioritet = "Medel",
                AntagenJaNej = null,
                AntagenJaNejMotivering = null
            }
        };

        SaveData(sampleData);
        _logger.LogInformation("Initialized JSON file with sample data at {Path}", _jsonFilePath);
    }

    private List<BestallaUppdragFrageformular> LoadData()
    {
        lock (_lock)
        {
            // If file doesn't exist, re-initialize it with sample data
            if (!File.Exists(_jsonFilePath))
            {
                _logger.LogWarning("JSON file not found at {Path}, re-initializing with sample data", _jsonFilePath);
                InitializeSampleData();
            }

            try
            {
                var json = File.ReadAllText(_jsonFilePath);
                
                // If file is empty or invalid, re-initialize
                if (string.IsNullOrWhiteSpace(json))
                {
                    _logger.LogWarning("JSON file is empty, re-initializing with sample data");
                    InitializeSampleData();
                    json = File.ReadAllText(_jsonFilePath);
                }
                
                var data = JsonSerializer.Deserialize<List<BestallaUppdragFrageformular>>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
                
                // If deserialization failed, re-initialize
                if (data == null || data.Count == 0)
                {
                    _logger.LogWarning("JSON file contains no valid data, re-initializing with sample data");
                    InitializeSampleData();
                    json = File.ReadAllText(_jsonFilePath);
                    data = JsonSerializer.Deserialize<List<BestallaUppdragFrageformular>>(json, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                }
                
                return data ?? new List<BestallaUppdragFrageformular>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading data from JSON file at {Path}, re-initializing", _jsonFilePath);
                // Try to re-initialize on error
                try
                {
                    InitializeSampleData();
                    var json = File.ReadAllText(_jsonFilePath);
                    var data = JsonSerializer.Deserialize<List<BestallaUppdragFrageformular>>(json, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                    return data ?? new List<BestallaUppdragFrageformular>();
                }
                catch
                {
                    return new List<BestallaUppdragFrageformular>();
                }
            }
        }
    }

    private void SaveData(List<BestallaUppdragFrageformular> data)
    {
        lock (_lock)
        {
            try
            {
                var json = JsonSerializer.Serialize(data, new JsonSerializerOptions
                {
                    WriteIndented = true
                });
                File.WriteAllText(_jsonFilePath, json);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving data to JSON file");
                throw;
            }
        }
    }

    public Task<IEnumerable<BestallaUppdragFrageformular>> GetAllAsync()
    {
        var data = LoadData();
        return Task.FromResult<IEnumerable<BestallaUppdragFrageformular>>(data.OrderByDescending(x => x.Gid));
    }

    public Task<BestallaUppdragFrageformular?> GetByIdAsync(int gid)
    {
        var data = LoadData();
        return Task.FromResult(data.FirstOrDefault(x => x.Gid == gid));
    }

    public Task<BestallaUppdragFrageformular> CreateAsync(BestallaUppdragFrageformular item)
    {
        var data = LoadData();
        
        // Generate next GID
        var maxGid = data.Any() ? data.Max(x => x.Gid) : 0;
        item.Gid = maxGid + 1;
        
        data.Add(item);
        SaveData(data);
        
        return Task.FromResult(item);
    }

    public Task<BestallaUppdragFrageformular?> UpdateAsync(int gid, BestallaUppdragFrageformular item)
    {
        var data = LoadData();
        var existing = data.FirstOrDefault(x => x.Gid == gid);
        
        if (existing == null)
        {
            return Task.FromResult<BestallaUppdragFrageformular?>(null);
        }

        existing.Arendernummer = item.Arendernummer;
        existing.Dataunderlag = item.Dataunderlag;
        existing.Dataadministrator = item.Dataadministrator;
        existing.Malgrupper = item.Malgrupper;
        existing.NyttjandeInterntExternt = item.NyttjandeInterntExternt;
        existing.Leverans = item.Leverans;
        existing.LeveransArbetstimmar = item.LeveransArbetstimmar;
        existing.Kategori = item.Kategori;
        existing.KategoriTyp = item.KategoriTyp;
        existing.Parioritet = item.Parioritet;
        existing.AntagenJaNej = item.AntagenJaNej;
        existing.AntagenJaNejMotivering = item.AntagenJaNejMotivering;
        
        SaveData(data);
        return Task.FromResult<BestallaUppdragFrageformular?>(existing);
    }

    public Task<bool> DeleteAsync(int gid)
    {
        var data = LoadData();
        var item = data.FirstOrDefault(x => x.Gid == gid);
        
        if (item == null)
        {
            return Task.FromResult(false);
        }

        data.Remove(item);
        SaveData(data);
        return Task.FromResult(true);
    }
}
