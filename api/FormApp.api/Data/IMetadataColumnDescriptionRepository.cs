using FormApp.Api.Models;

namespace FormApp.Api.Data;

    public interface IMetadataColumnDescriptionRepository
    {
        Task<IEnumerable<MetadataColumnDescription>> GetAllAsync();
        Task<MetadataColumnDescription?> GetByIdAsync(int gid);
    }


