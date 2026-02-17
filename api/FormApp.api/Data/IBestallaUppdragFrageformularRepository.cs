using FormApp.Api.Models;

namespace FormApp.Api.Data;

public interface IBestallaUppdragFrageformularRepository
{
    Task<IEnumerable<BestallaUppdragFrageformular>> GetAllAsync();
    Task<BestallaUppdragFrageformular?> GetByIdAsync(int gid);
    Task<BestallaUppdragFrageformular> CreateAsync(BestallaUppdragFrageformular item);
    Task<BestallaUppdragFrageformular?> UpdateAsync(int gid, BestallaUppdragFrageformular item);
    Task<bool> DeleteAsync(int gid);
}
