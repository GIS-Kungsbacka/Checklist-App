using FormApp.Api.Models;

namespace FormApp.Api.Data;

public interface IMetadataRepository
{
    Task<IEnumerable<Metadata>> GetAllAsync();
    Task<Metadata?> GetByIdAsync(int gid);
    Task<Metadata?> UpdateAsync(int gid, Metadata item);
    Task<bool> DeleteAsync(int gid);
}