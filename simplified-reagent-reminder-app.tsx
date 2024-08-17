import React, { useState, useEffect } from 'react';

const reagentData = [
  { name: "FACS Lysing Solution", usage2024: 6 },
  { name: "FACS Rinsing Solution", usage2024: 1 },
  { name: "FACS Cleaning Solution", usage2024: 8 },
  { name: "FacsFlow Sheath Solution", usage2024: 24 },
  { name: "FACS Shutdown Solution", usage2024: 24 },
  // Add more reagents as needed
];

const ReagentReminderApp = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const calculateReminders = () => {
      const newReminders = reagentData.map(reagent => {
        const monthlyUsage = reagent.usage2024 / 12;
        const monthsUntilOrder = Math.ceil(2 / monthlyUsage);
        const orderMonth = (currentMonth + monthsUntilOrder) % 12;
        return {
          ...reagent,
          orderMonth,
          urgent: monthsUntilOrder <= 2
        };
      });
      setReminders(newReminders);
    };

    calculateReminders();
  }, [currentMonth]);

  const getMonthName = (monthIndex) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthIndex];
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px'
  };

  const cellStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left'
  };

  const headerCellStyle = {
    ...cellStyle,
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold'
  };

  const urgentRowStyle = {
    backgroundColor: '#ffcccc'
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Reagent Ordering Reminder System</h1>
      <div style={{ backgroundColor: '#e6f3ff', border: '1px solid #b3d9ff', borderRadius: '5px', padding: '10px', marginBottom: '20px' }}>
        <p style={{ margin: 0 }}><strong>Reminder:</strong> Order reagents 2 months ahead of the suggested order month.</p>
      </div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headerCellStyle}>Reagent Name</th>
            <th style={headerCellStyle}>Estimated 2024 Usage</th>
            <th style={headerCellStyle}>Suggested Order Month</th>
          </tr>
        </thead>
        <tbody>
          {reminders.map((reagent, index) => (
            <tr key={index} style={reagent.urgent ? urgentRowStyle : {}}>
              <td style={cellStyle}>{reagent.name}</td>
              <td style={cellStyle}>{reagent.usage2024}</td>
              <td style={cellStyle}>{getMonthName(reagent.orderMonth)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReagentReminderApp;
