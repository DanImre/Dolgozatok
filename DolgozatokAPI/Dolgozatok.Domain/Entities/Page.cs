using System;
using System.Collections.Generic;
using System.Text;

namespace Dolgozatok.Domain.Entities
{
    public class Page
    {
        public int Id { get; set; }
        public int TestId { get; set; }
        public Test Test { get; set; } = null!;
        public int Number { get; set; }
        /// <summary>
        /// Determines whether the Tasks on this page are presented in random order.
        /// </summary>
        public bool IsRandomized { get; set; }
        public ICollection<Task> Tasks { get; set; } = new List<Task>();
    }
}
