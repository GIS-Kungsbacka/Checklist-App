using FormApp.Api.Data;
using FormApp.Api.Models;
using System.Text.Json;

namespace FormApp.Api.Data
{
    public class JsonManagementPlanRepository : IManagementPlanRepository
    {
        private readonly string _jsonFilePath;
        private readonly ILogger<JsonManagementPlanRepository> _logger;
        private readonly object _lock = new object();

        public JsonManagementPlanRepository(ILogger<JsonManagementPlanRepository> logger, IWebHostEnvironment env)
        {
            _logger = logger;
            _jsonFilePath = Path.Combine(env.ContentRootPath, "data", "managementplan.json");

            _logger.LogInformation("JSON ManagementPlan Repository initialized. File path: {Path}", _jsonFilePath);

            var directory = Path.GetDirectoryName(_jsonFilePath);
            if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            if (!File.Exists(_jsonFilePath))
            {
                _logger.LogInformation("ManagementPlan JSON file not found, initializing with one sample record");
                InitializeSampleData();
            }
        }

        private void InitializeSampleData()
        {
            var sample = new List<ManagementPlan>
            {
                new ManagementPlan
                {
                    Gid = 1,
                    ArendeNummberOpenE = "263521",
                    BestallareNamn = "Testnamn",
                    BestallareEpost = "testnamn@test.com",
                    Sakerhetsklass = "sk0_test",
                    DatakallaTyp = "Extern, organisation",
                    SchemaNamn = "sk0_schema_test",
                    Namn = "lekplatser_test_123",
                    Titel = "lekplatser_test_123",
                    DataAgare = "Testnamn",
                    DataForvaltare = "Jag",
                    DataAdministrator = ["Jag"],
                    DataKonsument = ["organisation"],
                    RedigeringsKalla = ["Extern", "organisation"],
                    OppnaData = false,
                    DokumentSkUrl = "https://example.com/dokument-sk",
                    DokuementInfoUrl = "https://example.com/dokument-info",
                    OvrigInformation = "Testinformation",
                    KritiskDatamangd = false,
                    Arkivering = "Nej",
                    ArkiveringTidpunkt = "Ej planerad",
                    Publicerad = ["Nej"],
                    PubliceradOppnaData = false,
                    Atkomst = ["Intern"],
                    Integration = ["Ingen"],
                    Status = "granskas",
                    Handlaggare = "Jag",
                    ForvaltningsplanVersion = "1.0",
                    SkapadTidPunkt = new DateTime(2026, 4, 14, 0, 0, 0, DateTimeKind.Utc),
                    SkapadAv = "System",
                    AndradTidPunkt = new DateTime(2026, 5, 14, 0, 0, 0, DateTimeKind.Utc),
                    AndradAv = "System",
                    ForvaltningsplanModelversion = "1.0",
                }
            };

            SaveData(sample);
        }

        private List<ManagementPlan> LoadData()
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
                    var data = JsonSerializer.Deserialize<List<ManagementPlan>>(json, options);
                    return data ?? new List<ManagementPlan>();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error loading management plan data from {Path}", _jsonFilePath);
                    try
                    {
                        InitializeSampleData();
                        var json = File.ReadAllText(_jsonFilePath);
                        return JsonSerializer.Deserialize<List<ManagementPlan>>(json,
                                   new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                               ?? new List<ManagementPlan>();
                    }
                    catch
                    {
                        return new List<ManagementPlan>();
                    }
                }
            }
        }

        private void SaveData(List<ManagementPlan> data)
        {
            lock (_lock)
            {
                var json = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(_jsonFilePath, json);
            }
        }

        public Task<IEnumerable<ManagementPlan>> GetAllAsync()
        {
            var data = LoadData();
            return Task.FromResult<IEnumerable<ManagementPlan>>(data.OrderByDescending(x => x.Gid));
        }

        public Task<ManagementPlan?> GetByIdAsync(int gid)
        {
            var data = LoadData();
            return Task.FromResult(data.FirstOrDefault(x => x.Gid == gid));
        }

        public Task<ManagementPlan> CreateAsync(ManagementPlan item)
        {
            var data = LoadData();
            var maxGid = data.Any() ? data.Max(x => x.Gid) : 0;
            item.Gid = maxGid + 1;
            data.Add(item);
            SaveData(data);
            return Task.FromResult(item);
        }

        public Task<ManagementPlan?> UpdateAsync(int gid, ManagementPlan item)
        {
            var data = LoadData();
            var existing = data.FirstOrDefault(x => x.Gid == gid);
            if (existing == null)
            {
                return Task.FromResult<ManagementPlan?>(null);
            }

            existing.ArendeNummberOpenE = item.ArendeNummberOpenE;
            existing.BestallareNamn = item.BestallareNamn;
            existing.BestallareEpost = item.BestallareEpost;
            existing.Sakerhetsklass = item.Sakerhetsklass;
            existing.DatakallaTyp = item.DatakallaTyp;
            existing.SchemaNamn = item.SchemaNamn;
            existing.Namn = item.Namn;
            existing.Titel = item.Titel;
            existing.DataAgare = item.DataAgare;
            existing.DataForvaltare = item.DataForvaltare;
            existing.DataAdministrator = item.DataAdministrator;
            existing.DataKonsument = item.DataKonsument;
            existing.RedigeringsKalla = item.RedigeringsKalla;
            existing.OppnaData = item.OppnaData;
            existing.DokumentSkUrl = item.DokumentSkUrl;
            existing.DokuementInfoUrl = item.DokuementInfoUrl;
            existing.OvrigInformation = item.OvrigInformation;
            existing.KritiskDatamangd = item.KritiskDatamangd;
            existing.Arkivering = item.Arkivering;
            existing.ArkiveringTidpunkt = item.ArkiveringTidpunkt;
            existing.Publicerad = item.Publicerad;
            existing.PubliceradOppnaData = item.PubliceradOppnaData;
            existing.Atkomst = item.Atkomst;
            existing.Integration = item.Integration;
            existing.Status = item.Status;
            existing.Handlaggare = item.Handlaggare;
            existing.ForvaltningsplanVersion = item.ForvaltningsplanVersion;
            existing.SkapadTidPunkt = item.SkapadTidPunkt;
            existing.SkapadAv = item.SkapadAv;
            existing.AndradTidPunkt = item.AndradTidPunkt;
            existing.AndradAv = item.AndradAv;

            SaveData(data);
            return Task.FromResult<ManagementPlan?>(existing);
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
}
