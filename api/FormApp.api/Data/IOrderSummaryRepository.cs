using FormApp.Api.Models;

namespace FormApp.Api.Data;

public interface IOrderSummaryRepository
{
    Task<IEnumerable<OrderSummary>> GetAllAsync();
    Task<OrderSummary?> GetByIdAsync(string arendenummerArtvise);
}
