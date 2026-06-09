namespace Dolgozatok.Domain.Entities
{
    public class OpenPeriod
    {
        public int Id { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public TimeSpan? TimeLimit { get; set; }
        public int TestId { get; set; }
        public Test Test { get; set; } = null!;
        public bool MultipleAttempts { get; set; }
    }
}
