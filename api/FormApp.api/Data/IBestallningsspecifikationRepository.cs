using FormApp.Api.Models;

namespace FormApp.Api.Data;

public interface IBestallningsspecifikationRepository
{
    Task<IEnumerable<Bestallningsspecifikation>> GetAllAsync();
    Task<Bestallningsspecifikation?> GetByIdAsync(int bestallningGid);
}
