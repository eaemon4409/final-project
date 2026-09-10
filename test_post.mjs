const payload = {
  installId: 'anon-test-install-uuid',
  pages: [
    {
      id: 'p1',
      url: 'https://apple.com/iphone-15-pro',
      domain: 'apple.com',
      title: 'iPhone 15 Pro',
      description: 'Apple flagship titanium phone with A17 Pro chip',
      importantText: 'iPhone 15 Pro features titanium design, A17 Pro chip, 48MP camera, 128GB base storage, $999 retail price. USB-C port with USB 3 speeds.',
      structuredData: '{"price": "$999", "brand": "Apple"}'
    },
    {
      id: 'p2',
      url: 'https://samsung.com/s24-ultra',
      domain: 'samsung.com',
      title: 'Samsung Galaxy S24 Ultra',
      description: 'Samsung flagship AI phone with S-Pen',
      importantText: 'Galaxy S24 Ultra features Snapdragon 8 Gen 3, titanium frame, 200MP camera, 256GB base storage, $1299 retail price. Integrated S-Pen stylus.',
      structuredData: '{"price": "$1299", "brand": "Samsung"}'
    }
  ],
  goal: 'Best value and camera for everyday use'
};

fetch('http://127.0.0.1:8000/api/v1/compare', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
  .then(res => {
    console.log('HTTP Status:', res.status);
    return res.json();
  })
  .then(data => {
    console.log('Success:', data.success);
    console.log('Title:', data.data?.title);
    console.log('Verdict:', data.data?.quick_verdict);
    console.log('Attributes count:', data.data?.attributes?.length);
    console.log('Best For:', data.data?.best_for);
  })
  .catch(err => {
    console.error('Error:', err.message);
  });
