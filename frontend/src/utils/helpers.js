// CSV Export function
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  const keys = Object.keys(data[0]);
  const csvContent = [
    keys.join(','),
    ...data.map((row) =>
      keys
        .map((key) => {
          const value = row[key];
          return typeof value === 'string' && value.includes(',')
            ? `"${value}"`
            : value;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

// CSV Import function
export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        const data = lines
          .slice(1)
          .filter((line) => line.trim())
          .map((line) => {
            const values = line.split(',');
            const obj = {};
            headers.forEach((header, index) => {
              obj[header.trim()] = values[index]?.trim();
            });
            return obj;
          });
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsText(file);
  });
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

// Format date
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

// Get month name
export const getMonthName = (month) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[month];
};
