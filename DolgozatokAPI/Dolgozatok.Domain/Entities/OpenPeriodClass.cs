namespace Dolgozatok.Domain.Entities
{
    public class OpenPeriodClass
    {
        public int Id { get; set; }
        public int OpenPeriodId { get; set; }
        public OpenPeriod OpenPeriod { get; set; } = null!;
        public int ClassId { get; set; }
        public Class Class { get; set; } = null!;
    }
}
