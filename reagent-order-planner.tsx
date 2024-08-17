import React, { useState } from 'react';

const ReagentOrderPlanner = () => {
  const [data, setData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const parsedData = parseCSV(text);
      setData(parsedData);
      generateSuggestions(parsedData);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text) => {
    const lines = text.split('\n');
    const headers = lines[2].split(',');
    return lines.slice(3).map(line => {
      const values = line.split(',');
      return headers.reduce((obj, header, index) => {
        obj[header.trim()] = values[index];
        return obj;
      }, {});
    });
  };

  const generateSuggestions = (parsedData) => {
    const currentYear = new Date().getFullYear();
    const suggestions = parsedData.map((row) => {
      const usage2024 = parseInt(row['2024 (ESTIMATION)']) || 0;
      const monthlyUsage = usage2024 / 12;
      const orderMonth = Math.floor(Math.random() * 12); // Random month for demonstration
      return {
        reagent: row['REAGENT'],
        orderMonth: orderMonth,
        suggestedQuantity: Math.ceil(monthlyUsage * 3), // Order for 3 months
      };
    });
    setSuggestions(suggestions);
  };

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Reagent,Order Month,Suggested Quantity\n"
      + suggestions.map(row => `${row.reagent},${new Date(0, row.orderMonth).toLocaleString('default', { month: 'long' })},${row.suggestedQuantity}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reagent_order_suggestions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Reagent Order Planner</h1>
      <input type="file" onChange={handleFileUpload} accept=".csv" className="mb-4 p-2 border rounded" />
      {suggestions.length > 0 && (
        <>
          <table className="w-full border-collapse border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Reagent</th>
                <th className="border border-gray-300 p-2">Order Month</th>
                <th className="border border-gray-300 p-2">Suggested Quantity</th>
              </tr>
            </thead>
            <tbody>
              {suggestions.map((suggestion, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{suggestion.reagent}</td>
                  <td className="border border-gray-300 p-2">{new Date(0, suggestion.orderMonth).toLocaleString('default', { month: 'long' })}</td>
                  <td className="border border-gray-300 p-2">{suggestion.suggestedQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={exportToCSV} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Export to CSV
          </button>
        </>
      )}
    </div>
  );
};

export default ReagentOrderPlanner;
