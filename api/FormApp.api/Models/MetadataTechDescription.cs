namespace FormApp.Api.Models
{
    public class MetadataTechDescription
    {
        public int Gid { get; set; }
        public string? Schema { get; set; }
        public string? Name { get; set; }
        public string? Datatype { get; set; }
        public int? Srid { get; set; }
        public string? GeometryDimension { get; set; }
        public string? GeometryType { get; set; }
        public string? GeometryColumn { get; set; }
    }
}
