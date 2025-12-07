using System;
using System.Collections.Generic;
using System.Text;

namespace Dolgozatok.Domain.Entities
{
    public class Test
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        // "datetime" in C# maps to "timestamp" in Postgres
        public DateTime AvailabilityDate { get; set; }
    }
}
