using FormApp.Api.Models;

namespace FormApp.Api.Data;

public interface IManagementPlanRepository
{
    Task<ManagementPlan> CreateAsync(ManagementPlan item);
    Task<ManagementPlan?> UpdateAsync(int gid, ManagementPlan item);
    Task<bool> DeleteAsync(int gid);
}