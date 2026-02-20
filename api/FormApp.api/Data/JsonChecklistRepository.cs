using System.Text.Json;
using FormApp.Api.Models;

namespace FormApp.Api.Data;
// Test data
public class JsonChecklistRepository : IChecklistRepository
{
    private readonly string _jsonFilePath;
    private readonly ILogger<JsonChecklistRepository> _logger;
    private readonly object _lock = new object();

    public JsonChecklistRepository(ILogger<JsonChecklistRepository> logger, IWebHostEnvironment env)
    {
        _logger = logger;
        // Store JSON file in the API folder
        _jsonFilePath = Path.Combine(env.ContentRootPath, "data", "checklist.json");
        
        _logger.LogInformation("JSON Checklist Repository initialized. File path: {Path}", _jsonFilePath);
        
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
        var sampleData = new List<Checklist>
        {
            new Checklist
            {
                Gid = 1,
                ArendenummerArtvise = "AR-2024-001",
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
                AntagenJaNejMotivering = "Projektet är välplanerat och har tillräcklig budget",
                Handlaggare = null,
            },
            new Checklist
            {
                Gid = 2,
                ArendenummerArtvise = "AR-2024-002",
                Dataunderlag = "Produktkatalog och lagerdata",
                Dataadministrator = "Erik",
                Malgrupper = "Logistik, Lager",
                NyttjandeInterntExternt = "Externt",
                Leverans = "API-integration",
                LeveransArbetstimmar = "60 timmar",
                Kategori = "Systemintegration",
                KategoriTyp = "Komplex",
                Prioritet = "Medel",
                AntagenJaNej = "Ja",
                AntagenJaNejMotivering = "Godkänd efter teknisk granskning",
                Handlaggare = "Test3",
            },
            new Checklist
            {
                Gid = 3,
                ArendenummerArtvise = "AR-2024-003",
                Dataunderlag = "Användardata och beteendeanalys",
                Dataadministrator = "Maria",
                Malgrupper = "IT, Utveckling",
                NyttjandeInterntExternt = "Internt",
                Leverans = "Dashboard och visualiseringar",
                LeveransArbetstimmar = "80 timmar",
                Kategori = "Business Intelligence",
                KategoriTyp = "Avancerad",
                Prioritet = "Hög",
                AntagenJaNej = "Nej",
                AntagenJaNejMotivering = "Projektet kräver ytterligare resurser som inte finns tillgängliga",
                Handlaggare = "Test2",
            },
            new Checklist
            {
                Gid = 4,
                ArendenummerArtvise = "AR-2024-004",
                Dataunderlag = "Ekonomiska rapporter och budgetdata",
                Dataadministrator = "Lars",
                Malgrupper = "Ekonomi, Ledning",
                NyttjandeInterntExternt = "Internt",
                Leverans = "Excel-rapporter och PowerPoint-presentationer",
                LeveransArbetstimmar = "20 timmar",
                Kategori = "Rapportering",
                KategoriTyp = "Standard",
                Prioritet = "Låg",
                AntagenJaNej = "Ja",
                AntagenJaNejMotivering = "Rutinuppdrag som kan genomföras snabbt",
                Handlaggare = "Test",
            },
            new Checklist
            {
                Gid = 5,
                ArendenummerArtvise = "AR-2024-005",
                Dataunderlag = "Kundfeedback och nöjdhetsundersökningar",
                Dataadministrator = "Sara",
                Malgrupper = "Kundservice, Marknadsföring",
                NyttjandeInterntExternt = "Externt",
                Leverans = "Analysrapport med rekommendationer",
                LeveransArbetstimmar = "30 timmar",
                Kategori = "Kundanalys",
                KategoriTyp = "Standard",
                Prioritet = "Medel",
                AntagenJaNej = null,
                AntagenJaNejMotivering = null,
                Handlaggare = null,
            }
        };

        SaveData(sampleData);
        _logger.LogInformation("Initialized JSON file with sample data at {Path}", _jsonFilePath);
    }

    private List<Checklist> LoadData()
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
                
                var data = JsonSerializer.Deserialize<List<Checklist>>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
                
                // If deserialization failed, re-initialize
                if (data == null || data.Count == 0)
                {
                    _logger.LogWarning("JSON file contains no valid data, re-initializing with sample data");
                    InitializeSampleData();
                    json = File.ReadAllText(_jsonFilePath);
                    data = JsonSerializer.Deserialize<List<Checklist>>(json, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                }
                
                return data ?? new List<Checklist>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading data from JSON file at {Path}, re-initializing", _jsonFilePath);
                // Try to re-initialize on error
                try
                {
                    InitializeSampleData();
                    var json = File.ReadAllText(_jsonFilePath);
                    var data = JsonSerializer.Deserialize<List<Checklist>>(json, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                    return data ?? new List<Checklist>();
                }
                catch
                {
                    return new List<Checklist>();
                }
            }
        }
    }

    private void SaveData(List<Checklist> data)
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

    public Task<IEnumerable<Checklist>> GetAllAsync()
    {
        var data = LoadData();
        return Task.FromResult<IEnumerable<Checklist>>(data.OrderByDescending(x => x.Gid));
    }

    public Task<Checklist?> GetByIdAsync(int gid)
    {
        var data = LoadData();
        return Task.FromResult(data.FirstOrDefault(x => x.Gid == gid));
    }

    public Task<Checklist> CreateAsync(Checklist item)
    {
        var data = LoadData();
        
        // Generate next GID
        var maxGid = data.Any() ? data.Max(x => x.Gid) : 0;
        item.Gid = maxGid + 1;
        
        data.Add(item);
        SaveData(data);
        
        return Task.FromResult(item);
    }

    public Task<Checklist?> UpdateAsync(int gid, Checklist item)
    {
        var data = LoadData();
        var existing = data.FirstOrDefault(x => x.Gid == gid);
        
        if (existing == null)
        {
            return Task.FromResult<Checklist?>(null);
        }

        existing.ArendenummerArtvise = item.ArendenummerArtvise;
        existing.Dataunderlag = item.Dataunderlag;
        existing.Dataadministrator = item.Dataadministrator;
        existing.Malgrupper = item.Malgrupper;
        existing.NyttjandeInterntExternt = item.NyttjandeInterntExternt;
        existing.Leverans = item.Leverans;
        existing.LeveransArbetstimmar = item.LeveransArbetstimmar;
        existing.Kategori = item.Kategori;
        existing.KategoriTyp = item.KategoriTyp;
        existing.Prioritet = item.Prioritet;
        existing.AntagenJaNej = item.AntagenJaNej;
        existing.AntagenJaNejMotivering = item.AntagenJaNejMotivering;
        existing.Handlaggare = item.Handlaggare;
        
        SaveData(data);
        return Task.FromResult<Checklist?>(existing);
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
