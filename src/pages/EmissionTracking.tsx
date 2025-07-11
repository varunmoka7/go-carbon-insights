import React from 'react';
import { Link } from 'react-router-dom';

// Placeholder for sticky sidebar
const Sidebar = () => (
  <aside className="emission-tracking-sidebar fixed left-0 top-0 h-full w-56 bg-[#F5F5DC] shadow-lg p-6 z-10">
    <h2 className="text-[#2E7D32] font-bold text-lg mb-4">Filters</h2>
    {/* Add filter controls here */}
    <div className="mt-8 text-xs text-gray-500">Sustainability Sidebar</div>
  </aside>
);

// Placeholder for header
const Header = () => (
  <header className="emission-tracking-header w-full py-8 px-8 bg-gradient-to-r from-[#2E7D32] to-[#4FC3F7] text-white shadow-md flex flex-col items-center mb-8">
    <h1 className="text-3xl font-extrabold tracking-tight mb-2">Track Your Path to Net Zero</h1>
    <p className="text-lg opacity-90">Sustainability-Themed Emission Tracking</p>
  </header>
);

// Placeholder for card widget
const StatCard = ({ title, value, accent }: { title: string, value: string, accent: string }) => (
  <div className={`emission-tracking-card bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center transition-transform hover:scale-105 border-t-4 ${accent} animate-fade-in`}>
    <div className="text-2xl font-bold mb-2">{value}</div>
    <div className="text-sm text-gray-700">{title}</div>
  </div>
);

// Placeholder for chart
const EmissionChart = () => (
  <div className="emission-tracking-chart bg-[#F5F5DC] rounded-xl shadow p-6 flex flex-col items-center justify-center min-h-[250px] animate-fade-in">
    <div className="text-[#2E7D32] font-semibold mb-2">Emission Trends</div>
    {/* Chart.js chart will go here */}
    <div className="text-gray-400">[Interactive Line Chart Placeholder]</div>
  </div>
);

// Placeholder for tips
const TipsSection = () => (
  <div className="emission-tracking-tips bg-[#FFCA28] rounded-xl shadow p-6 mt-8 animate-fade-in">
    <div className="font-bold text-[#2E7D32] mb-2">Tips for Reduction</div>
    <ul className="list-disc pl-5 text-gray-800">
      <li>Switch to public transport for daily commute</li>
      <li>Reduce energy usage during peak hours</li>
      <li>Choose plant-based meals more often</li>
    </ul>
  </div>
);

const EmissionTracking: React.FC = () => {
  return (
    <div className="emission-tracking-root min-h-screen bg-[#F5F5DC] flex">
      <Sidebar />
      <main className="emission-tracking-main flex-1 ml-56 p-8">
        <div className="mb-4">
          <Link to="/" className="inline-block bg-[#4FC3F7] text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-[#2E7D32] transition-colors">← Back to Home</Link>
        </div>
        <Header />
        <section className="emission-tracking-stats grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Emissions" value="41.4M tCO2e" accent="border-[#2E7D32]" />
          <StatCard title="Transport" value="12.1M tCO2e" accent="border-[#4FC3F7]" />
          <StatCard title="Energy" value="18.2M tCO2e" accent="border-[#FFCA28]" />
          <StatCard title="Food" value="11.1M tCO2e" accent="border-[#2E7D32]" />
        </section>
        <EmissionChart />
        <TipsSection />
      </main>
    </div>
  );
};

export default EmissionTracking;

// Scoped styles (add to a CSS module or global if using Tailwind JIT)
// .emission-tracking-root { ... }
// .emission-tracking-header { ... }
// .emission-tracking-sidebar { ... }
// .emission-tracking-card { ... }
// .emission-tracking-chart { ... }
// .emission-tracking-tips { ... }
// .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; } 