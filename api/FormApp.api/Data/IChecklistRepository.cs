using FormApp.Api.Models;

namespace FormApp.Api.Data;

public interface IChecklistRepository
{
    Task<IEnumerable<Checklist>> GetAllAsync();
    Task<Checklist?> GetByIdAsync(int gid);
    Task<Checklist> CreateAsync(Checklist item);
    Task<Checklist?> UpdateAsync(int gid, Checklist item);
    Task<bool> DeleteAsync(int gid);
}
