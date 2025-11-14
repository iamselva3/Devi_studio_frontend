import React, { useEffect, useState } from "react";

const Counter = ({ target, duration }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 10);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      setCount(Math.floor(start));
    }, 10);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count.toLocaleString()}</span>;
};

const Stats = () => {
  return (
    <section className="w-full bg-black py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 text-center gap-10">

        {/* Item 1 */}
        <div>
          <div className="text-4xl font-semibold text-white mb-2">
            <Counter target={2} duration={1200} />
          </div>
          <p className="text-lg text-gray-600">Locations</p>
        </div>

        {/* Item 2 */}
        <div>
          <div className="text-4xl font-semibold text-white mb-2">
            <Counter target={10000} duration={2000} />+
          </div>
          <p className="text-lg text-gray-600">Weddings</p>
        </div>

        {/* Item 3 */}
        <div>
          <div className="text-4xl font-semibold text-white mb-2">
            <Counter target={200} duration={1500} />+
          </div>
          <p className="text-lg text-gray-600">Employees</p>
        </div>

        {/* Item 4 */}
        <div>
          <div className="text-4xl font-semibold text-white mb-2">
            <Counter target={1} duration={1000} />
          </div>
          <p className="text-lg text-gray-600">Dream</p>
        </div>

      </div>
    </section>
  );
};

export default Stats;
