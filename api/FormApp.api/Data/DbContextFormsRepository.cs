using FormApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FormApp.Api.Data;

public class DbContextFormsRepository : IFormsRepository
{
    private readonly AppDbContext _context;

    public DbContextFormsRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Form>> GetAllAsync()
    {
        return await _context.Forms
            .OrderByDescending(f => f.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Form>> GetActiveAsync()
    {
        return await _context.Forms
            .Where(f => f.IsActive)
            .OrderByDescending(f => f.CreatedAt)
            .ToListAsync();
    }

    public async Task<Form?> GetByIdAsync(int id)
    {
        return await _context.Forms.FindAsync(id);
    }

    public async Task<Form?> GetActiveByIdAsync(int id)
    {
        return await _context.Forms
            .Where(f => f.Id == id && f.IsActive)
            .FirstOrDefaultAsync();
    }

    public async Task<Form> CreateAsync(Form form)
    {
        _context.Forms.Add(form);
        await _context.SaveChangesAsync();
        return form;
    }

    public async Task<Form?> UpdateAsync(int id, Form form)
    {
        var existing = await _context.Forms.FindAsync(id);
        if (existing == null)
        {
            return null;
        }

        existing.Name = form.Name;
        existing.Description = form.Description;
        existing.SchemaJson = form.SchemaJson;
        existing.IsActive = form.IsActive;
        existing.UpdatedBy = form.UpdatedBy;
        existing.UpdatedAt = DateTimeOffset.UtcNow;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var form = await _context.Forms.FindAsync(id);
        if (form == null)
        {
            return false;
        }

        _context.Forms.Remove(form);
        await _context.SaveChangesAsync();
        return true;
    }
}
