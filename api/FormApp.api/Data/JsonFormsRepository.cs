using System.Text.Json;
using FormApp.Api.Models;

namespace FormApp.Api.Data;

public class JsonFormsRepository : IFormsRepository
{
    private readonly string _jsonFilePath;
    private readonly ILogger<JsonFormsRepository> _logger;
    private readonly object _lock = new object();

    public JsonFormsRepository(ILogger<JsonFormsRepository> logger, IWebHostEnvironment env)
    {
        _logger = logger;
        // Store JSON file in the API folder
        _jsonFilePath = Path.Combine(env.ContentRootPath, "data", "forms.json");
        
        _logger.LogInformation("JSON Forms Repository initialized. File path: {Path}", _jsonFilePath);
        
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
        var sampleForms = new List<Form>
        {
            new Form
            {
                Id = 1,
                Name = "Sample test form",
                Description = "This is a sample form for testing purposes",
                SchemaJson = @"{
  ""type"": ""object"",
  ""properties"": {
    ""firstName"": {
      ""type"": ""string"",
      ""title"": ""First Name"",
      ""required"": true
    },
    ""lastName"": {
      ""type"": ""string"",
      ""title"": ""Last Name"",
      ""required"": true
    },
    ""email"": {
      ""type"": ""string"",
      ""title"": ""Email"",
      ""format"": ""email"",
      ""required"": true
    },
    ""comments"": {
      ""type"": ""string"",
      ""title"": ""Comments"",
      ""format"": ""textarea""
    }
  }
}",
                IsActive = true,
                CreatedBy = "System",
                CreatedAt = DateTimeOffset.UtcNow
            },
            new Form
            {
                Id = 2,
                Name = "Contact Form",
                Description = "A simple contact form for customer inquiries",
                SchemaJson = @"{
  ""type"": ""object"",
  ""properties"": {
    ""name"": {
      ""type"": ""string"",
      ""title"": ""Name"",
      ""required"": true
    },
    ""email"": {
      ""type"": ""string"",
      ""title"": ""Email"",
      ""format"": ""email"",
      ""required"": true
    },
    ""message"": {
      ""type"": ""string"",
      ""title"": ""Message"",
      ""format"": ""textarea"",
      ""required"": true
    }
  }
}",
                IsActive = true,
                CreatedBy = "System",
                CreatedAt = DateTimeOffset.UtcNow.AddDays(-1)
            }
        };

        SaveForms(sampleForms);
        _logger.LogInformation("Initialized JSON file with sample data at {Path}", _jsonFilePath);
    }

    private List<Form> LoadForms()
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
                
                var forms = JsonSerializer.Deserialize<List<Form>>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
                
                // If deserialization failed, re-initialize
                if (forms == null || forms.Count == 0)
                {
                    _logger.LogWarning("JSON file contains no valid forms, re-initializing with sample data");
                    InitializeSampleData();
                    json = File.ReadAllText(_jsonFilePath);
                    forms = JsonSerializer.Deserialize<List<Form>>(json, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                }
                
                return forms ?? new List<Form>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading forms from JSON file at {Path}, re-initializing", _jsonFilePath);
                // Try to re-initialize on error
                try
                {
                    InitializeSampleData();
                    var json = File.ReadAllText(_jsonFilePath);
                    var forms = JsonSerializer.Deserialize<List<Form>>(json, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                    return forms ?? new List<Form>();
                }
                catch
                {
                    return new List<Form>();
                }
            }
        }
    }

    private void SaveForms(List<Form> forms)
    {
        lock (_lock)
        {
            try
            {
                var json = JsonSerializer.Serialize(forms, new JsonSerializerOptions
                {
                    WriteIndented = true
                });
                File.WriteAllText(_jsonFilePath, json);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving forms to JSON file");
                throw;
            }
        }
    }

    public Task<IEnumerable<Form>> GetAllAsync()
    {
        var forms = LoadForms();
        return Task.FromResult<IEnumerable<Form>>(forms.OrderByDescending(f => f.CreatedAt));
    }

    public Task<IEnumerable<Form>> GetActiveAsync()
    {
        var forms = LoadForms();
        return Task.FromResult<IEnumerable<Form>>(
            forms.Where(f => f.IsActive).OrderByDescending(f => f.CreatedAt)
        );
    }

    public Task<Form?> GetByIdAsync(int id)
    {
        var forms = LoadForms();
        return Task.FromResult(forms.FirstOrDefault(f => f.Id == id));
    }

    public Task<Form?> GetActiveByIdAsync(int id)
    {
        var forms = LoadForms();
        return Task.FromResult(forms.FirstOrDefault(f => f.Id == id && f.IsActive));
    }

    public Task<Form> CreateAsync(Form form)
    {
        var forms = LoadForms();
        
        // Generate next ID
        var maxId = forms.Any() ? forms.Max(f => f.Id) : 0;
        form.Id = maxId + 1;
        form.CreatedAt = DateTimeOffset.UtcNow;
        
        forms.Add(form);
        SaveForms(forms);
        
        return Task.FromResult(form);
    }

    public Task<Form?> UpdateAsync(int id, Form form)
    {
        var forms = LoadForms();
        var existing = forms.FirstOrDefault(f => f.Id == id);
        
        if (existing == null)
        {
            return Task.FromResult<Form?>(null);
        }

        existing.Name = form.Name;
        existing.Description = form.Description;
        existing.SchemaJson = form.SchemaJson;
        existing.IsActive = form.IsActive;
        existing.UpdatedBy = form.UpdatedBy;
        existing.UpdatedAt = DateTimeOffset.UtcNow;
        
        SaveForms(forms);
        return Task.FromResult<Form?>(existing);
    }

    public Task<bool> DeleteAsync(int id)
    {
        var forms = LoadForms();
        var form = forms.FirstOrDefault(f => f.Id == id);
        
        if (form == null)
        {
            return Task.FromResult(false);
        }

        forms.Remove(form);
        SaveForms(forms);
        return Task.FromResult(true);
    }
}
