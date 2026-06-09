namespace Dolgozatok.Domain.Entities
{
    public class TaskElement
    {
        public int Id { get; set; }
        public int TaskId { get; set; }
        public Task Task { get; set; } = null!;
        public string Body { get; set; } = string.Empty;
        public string CorrectAnswer { get; set; } = string.Empty;
        public ICollection<Solution> Solutions { get; set; } = new List<Solution>();
    }
}
