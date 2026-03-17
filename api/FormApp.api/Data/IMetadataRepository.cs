using FormApp.Api.Models;

namespace FormApp.Api.Data;

public interface IMetadataRepository
{
    Task<Metadata> CreateAsync(Metadata item);
    Task<Metadata?> UpdateAsync(int gid, Metadata item);
    Task<bool> DeleteAsync(int gid);
}