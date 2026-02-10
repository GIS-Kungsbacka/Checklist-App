using FormApp.Api.Models;

namespace FormApp.Api.Data;

public interface IFormsRepository
{
    Task<IEnumerable<Form>> GetAllAsync();
    Task<IEnumerable<Form>> GetActiveAsync();
    Task<Form?> GetByIdAsync(int id);
    Task<Form?> GetActiveByIdAsync(int id);
    Task<Form> CreateAsync(Form form);
    Task<Form?> UpdateAsync(int id, Form form);
    Task<bool> DeleteAsync(int id);
}
