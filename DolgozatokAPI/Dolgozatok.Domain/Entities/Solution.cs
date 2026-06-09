namespace Dolgozatok.Domain.Entities
{
    public class Solution
    {
        public int Id { get; set; }
        public int TaskElementId { get; set; }
        public TaskElement TaskElement { get; set; } = null!;
        public int UserId { get; set; }
        public int AttemptNumber { get; set; }
        public DateTime? SubmittedAt { get; set; }
        public DateTime StartedAt { get; set; }
        public string Body { get; set; } = string.Empty;
        public int? Score { get; set; }
    }
}
