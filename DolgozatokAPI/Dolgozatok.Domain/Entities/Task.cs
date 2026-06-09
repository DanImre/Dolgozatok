using Dolgozatok.Domain.Enums;

namespace Dolgozatok.Domain.Entities
{
    public class Task
    {
        public int Id { get; set; }
        public int PageId { get; set; }
        public Page Page { get; set; } = null!;
        public string Header { get; set; } = string.Empty;
        public int Number { get; set; }
        public TaskTypes Type { get; set; } = TaskTypes.Numerical;
        public ICollection<TaskElement> TaskElements { get; set; } = new List<TaskElement>();
    }
}
