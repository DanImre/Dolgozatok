using Dolgozatok.Domain.Enums;

namespace Dolgozatok.Domain.Entities
{
    public class ReviewableTest
    {
        public int Id { get; set; }
        public int OriginalTestId { get; set; }
        public DateTime Start { get; set; } = DateTime.UtcNow.Date;
        public DateTime End { get; set; } = DateTime.UtcNow.AddDays(7).Date;
        public TestReviewOptions VisibilityOption { get; set; } = TestReviewOptions.WithSolutions;
    }
}
