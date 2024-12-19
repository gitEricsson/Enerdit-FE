import React, { useRef } from 'react';
import { Download, ArrowLeft } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import html2canvas from 'html2canvas';

const AuditReport = ({ auditData, onBack }) => {
  const reportRef = useRef(null);
  const buildingType = auditData.building_type;
  const compartments = auditData.compartments;
  const floors = auditData.num_floors;
  const recommendations = auditData.recommendations;
  const totalEnergyConsumed = auditData.total_energy_consumed;
  const totalEnergyCost = auditData.total_energy_cost;
  const energyConsumptionScore = auditData.energy_consumption_score;

  const downloadReport = () => {
    if (reportRef.current) {
      html2canvas(reportRef.current).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'ENERDIT_Energy_Audit_Report.png';
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  const COLORS = [
    '#003f5c',
    '#ffa600',
    '#2f4b7c',
    '#FFBB28',
    '#665191',
    '#82CA9D',
    '#a05195',
    '#FFCE56',
    '#d45087',
    '#36A2EB',
    '#f95d6a',
    '#4BC0C0',
    '#ff7c43',
    '#FF8042',
    '#0088FE',
    '#FF9F40',
    '#8884D8',
    '#9966FF',
    '#FF6384',
    '#00C49F',
  ];

  // Transform data to create separate entries for each appliance
  const transformedData = compartments.map((compartment) => {
    const data = {
      name: compartment.name,
    };

    compartment.appliances.forEach((appliance) => {
      const existingKeys = Object.keys(data).filter((key) =>
        key.startsWith(appliance.name)
      );

      const applianceKey =
        existingKeys.length > 0
          ? `${appliance.name} ${existingKeys.length + 1}`
          : appliance.name;

      data[applianceKey] = appliance.total_energy_consumed;
    });

    return data;
  });

  const allKeys = [
    ...new Set(
      transformedData.flatMap((data) =>
        Object.keys(data).filter((key) => key !== 'name')
      )
    ),
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white p-2 border border-gray-200 shadow-md">
        <p className="font-bold">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value.toFixed(2)} kWh/day
          </p>
        ))}
      </div>
    );
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div ref={reportRef} className="p-4 md:p-8 bg-[e6f7e9]">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-4xl font-bold">
          {window.innerWidth < 768
            ? 'Audit Report'
            : 'ENERDIT Energy Audit Report'}
        </h2>
        <button
          className="flex items-center text-[#002713]"
          onClick={downloadReport}
        >
          <Download size={20} className="mr-2" />
          Download
        </button>
      </div>

      <div className="p-6 rounded-lg mb-8 bg-white shadow-md">
        <h3 className="text-xl font-bold mb-2">Building Information</h3>
        <ul className="list-disc list-inside md:ml-4 bg-[#e6f7e9] p-6 rounded-lg">
          <li className="mb-4">Type: {buildingType}</li>
          <li>Number of Floors: {floors}</li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-bold mb-4">
          Energy Consumption Distribution
        </h3>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="w-full md:w-1/2 md:pr-4 mb-4 md:mb-0">
            <h4 className="text-lg font-semibold mb-2 text-center">
              By Compartment
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={compartments.map((compartment) => ({
                    name: compartment.name,
                    value: compartment.total_energy_consumed,
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {compartments.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full md:w-1/2 md:pl-4">
            <h4 className="text-lg font-semibold mb-2 text-center">
              By Appliance
            </h4>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={transformedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />
                <YAxis
                  label={{
                    value: 'Energy Consumption (kWh/day)',
                    angle: -90,
                    position: 'insideLeft',
                    style: { fontSize: 12 },
                    dy: 80,
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {allKeys.map((key, index) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    stackId="a"
                    fill={COLORS[index % COLORS.length]}
                    name={key}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-bold mb-4">Energy Consumption Summary</h3>
        <div className="overflow-x-auto w-full">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-[#c1e6c8]">
                <th className="p-2 text-left">Compartment</th>
                <th className="p-2 text-left">Total Energy (kWh/day)</th>
                <th className="p-2 text-left">Cost (₦/day)</th>
              </tr>
            </thead>
            <tbody>
              {compartments.map((compartment, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? 'bg-[#e6f7e9]' : 'bg-white'}
                >
                  <td className="p-2">{compartment.name}</td>
                  <td className="p-2">
                    {compartment.total_energy_consumed.toFixed(2)}
                  </td>
                  <td className="p-2">
                    {compartment.total_energy_cost.toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="font-bold bg-[#c1e6c8]">
                <td className="p-2">Total</td>
                <td className="p-2">{totalEnergyConsumed.toFixed(2)}</td>
                <td className="p-2">{totalEnergyCost.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-bold mb-4">
          Detailed Breakdown by Compartment
        </h3>
        {compartments.map(
          (compartment, index) =>
            compartment.appliances.length > 0 && (
              <div key={index} className="mb-6">
                <h4 className="text-lg font-semibold mb-2">
                  {compartment.name}
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#c1e6c8]">
                        <th className="p-2 text-left">Appliance</th>
                        <th className="p-2 text-left">Power Rating (KW)</th>
                        <th className="p-2 text-left">Usage Time (hrs/day)</th>
                        <th className="p-2 text-left">Energy (kWh/day)</th>
                        <th className="p-2 text-left">Cost (₦/day)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {compartment.appliances.map((appliance, appIndex) => (
                        <tr
                          key={appIndex}
                          className={
                            appIndex % 2 === 0 ? 'bg-[#e6f7e9]' : 'bg-white'
                          }
                        >
                          <td className="p-2">{appliance.name}</td>
                          <td className="p-2">{appliance.power_rating}</td>
                          <td className="p-2">{appliance.usage_time}</td>
                          <td className="p-2">
                            {appliance.total_energy_consumed.toFixed(2)}
                          </td>
                          <td className="p-2">
                            {appliance.total_energy_cost.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Energy Consumption Score</h3>
        <div className="text-6xl font-bold text-green-600">
          {energyConsumptionScore}
        </div>
        <p className="text-lg mt-2">Efficient</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-bold mb-4">
          Energy-Saving Recommendations
        </h3>
        <ol className="list-decimal list-inside">
          {recommendations.map((rec, index) => (
            <li key={index} className="mb-2">
              <strong>{rec.category}:</strong>
              <ul className="list-disc list-inside ml-4">
                {rec.recommendations.map((recommendation, recIndex) => (
                  <li key={recIndex}>{recommendation}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <p className="mt-4">
          By implementing these recommendations, you could potentially reduce
          your energy consumption significantly, leading to cost savings and a
          reduced carbon footprint.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="bg-[#002713] text-white px-6 py-3 rounded-lg flex items-center hover:bg-[#003f1f] transition-colors duration-300"
        >
          <ArrowLeft size={20} className="mr-2" />
          {window.innerWidth < 768 ? 'Back' : 'Back to Audit'}
        </button>
        <div className="text-right">
          <p className="text-l font-bold text-[#002713]">
            Total Energy Consumed: {totalEnergyConsumed.toFixed(2)} kWh/day
          </p>
          <p className="text-l font-bold text-[#002713]">
            Total Energy Cost: ₦{totalEnergyCost.toFixed(2)}/day
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuditReport;
