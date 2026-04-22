using FormApp.Api.Data;
using FormApp.Api.Models;
using System.Text.Json;

 namespace FormApp.Api.Data
{
    public class JsonMetadataRepository:IMetadataRepository
    {
        private readonly string _jsonFilePath;
        private readonly ILogger<JsonMetadataRepository> _logger;
        private readonly object _lock = new object();

        public JsonMetadataRepository(ILogger<JsonMetadataRepository> logger, IWebHostEnvironment env)
        {
            _logger = logger;
            _jsonFilePath = Path.Combine(env.ContentRootPath, "data", "metadata.json");

            _logger.LogInformation("JSON Metadata Repository initialized. File path: {Path}", _jsonFilePath);

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
            var sample = new List<Metadata>
        {
            new Metadata
            {
                Gid = 1,
                ArendeNummerOpenE = "263521",
                BestallareNamn = "Testnamn",
                BestallareEpost = "testnamn@test.com",
                SakerhetsKlass = "sk0_test",
                DataKallaTyp = "Extern, organisation",
                SchemaNamn = "sk0_schema_test",
                Namn = "lekplatser_test_123",
                Beskrivning = "Test beskrivning",
                Ursprung = ["Extern", "Organisation"],
                Syfte = "Att identifiera alla lekplatser och ta en kopp kaffe",
                Metod = "Fjärranalys",
                MetodUrl = "https://example.com/metod",
                Projekt = "Testprojekt",
                GeografiskBegransning = ["tätort","test"],
                UppdateringsFrekvens = "Årligen",
                Fullstandighet = "Fullständig",
                Skalniva = "2",
                NyckelOrd = ["Tätortsmiljö","Test"],
                Kategori = "Byggnader och byggnadskonstruktioner",
                Tidsperiod = false,
                TidsperiodStartdatum = new DateOnly(2026, 4, 15),
                TidsperiodSlutdatum = new DateOnly(2026, 4, 15),
                TidsUpplosning = "Sekund",
                SkapelseDatum = new DateOnly(2026, 4, 14),
                AnvandarBegransningLicens = false,
                AnvandarBegransningLicensText = "Test",
                RelateradeResurser = ["Nej"],
                KolumnBeskrivningUrl = "https://example.com/kolumner",
                Status = "granskas",
                Handlaggare = "Jag",
                MetaDataVersion = "1.0"
            }
        };

            SaveData(sample);
        }

        private List<Metadata> LoadData()
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
                    var data = JsonSerializer.Deserialize<List<Metadata>>(json, options);
                    return data ?? new List<Metadata>();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error loading order summary from {Path}", _jsonFilePath);
                    try
                    {
                        InitializeSampleData();
                        var json = File.ReadAllText(_jsonFilePath);
                        return JsonSerializer.Deserialize<List<Metadata>>(json,
                            new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<Metadata>();
                    }
                    catch
                    {
                        return new List<Metadata>();
                    }
                }
            }
        }


        private void SaveData(List<Metadata> data)
        {
            lock (_lock)
            {
                var json = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(_jsonFilePath, json);
            }
        }

        public Task<IEnumerable<Metadata>> GetAllAsync()
        {
            var data = LoadData();
            return Task.FromResult<IEnumerable<Metadata>>(data.OrderByDescending(x => x.Gid));
        }

        public Task<Metadata?> GetByIdAsync(int gid)
        {
            var data = LoadData();
            return Task.FromResult(data.FirstOrDefault(x => x.Gid == gid));
        }

        public Task<Metadata?> UpdateAsync(int gid, Metadata item)
        {
            var data = LoadData();
            var existing = data.FirstOrDefault(x => x.Gid == gid);
            if (existing == null)
            {
                return Task.FromResult<Metadata?>(null);
            }

            existing.ArendeNummerOpenE = item.ArendeNummerOpenE;
            existing.BestallareNamn = item.BestallareNamn;
            existing.BestallareEpost = item.BestallareEpost;
            existing.SakerhetsKlass = item.SakerhetsKlass;
            existing.DataKallaTyp = item.DataKallaTyp;
            existing.SchemaNamn = item.SchemaNamn;
            existing.Namn = item.Namn;
            existing.Beskrivning = item.Beskrivning;
            existing.Ursprung = item.Ursprung;
            existing.Syfte = item.Syfte;
            existing.Metod = item.Metod;
            existing.MetodUrl = item.MetodUrl;
            existing.Projekt = item.Projekt;
            existing.GeografiskBegransning = item.GeografiskBegransning;
            existing.UppdateringsFrekvens = item.UppdateringsFrekvens;
            existing.Fullstandighet = item.Fullstandighet;
            existing.Skalniva = item.Skalniva;
            existing.NyckelOrd = item.NyckelOrd;
            existing.Kategori = item.Kategori;
            existing.Tidsperiod = item.Tidsperiod;
            existing.TidsperiodStartdatum = item.TidsperiodStartdatum;
            existing.TidsperiodSlutdatum = item.TidsperiodSlutdatum;
            existing.TidsUpplosning = item.TidsUpplosning;
            existing.SkapelseDatum = item.SkapelseDatum;
            existing.AnvandarBegransningLicens = item.AnvandarBegransningLicens;
            existing.AnvandarBegransningLicensText = item.AnvandarBegransningLicensText;
            existing.RelateradeResurser = item.RelateradeResurser;
            existing.KolumnBeskrivningUrl = item.KolumnBeskrivningUrl;
            existing.Status = item.Status;
            existing.Handlaggare = item.Handlaggare;
            existing.MetaDataVersion = item.MetaDataVersion;

            SaveData(data);
            return Task.FromResult<Metadata?>(existing);
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


