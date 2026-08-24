using FormApp.Api.Models;

namespace FormApp.Api.Data;

public interface IMetadataTechDescriptionRepository
{
    Task<IEnumerable<MetadataTechDescription>> GetAllAsync();
    Task<MetadataTechDescription?> GetByIdAsync(int gid);
}
