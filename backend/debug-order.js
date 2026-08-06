const http = require('http');

const request = (options, body) => new Promise((resolve, reject) => {
  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
  });
  req.on('error', reject);
  if (body) req.write(body);
  req.end();
});

(async () => {
  try {
    const products = await request({ hostname: 'localhost', port: 5000, path: '/api/products', method: 'GET' });
    console.log('PRODUCTS', products.statusCode, products.body);
    const productList = JSON.parse(products.body);
    const prodId = productList[0]?._id || productList[0]?.id;
    if (!prodId) {
      throw new Error('No product ID found');
    }

    const loginBody = JSON.stringify({ email: 'admin@shopnest.com', password: 'password123' });
    const login = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginBody)
      }
    }, loginBody);
    console.log('LOGIN', login.statusCode, login.body);
    const loginData = JSON.parse(login.body);
    if (!loginData.token) {
      throw new Error('Login did not return token');
    }

    const orderBody = JSON.stringify({
      items: [{ product: prodId, qty: 1, price: 85 }],
      totalAmount: 85,
      address: {
        fullName: 'Test User',
        street: '123 Test St',
        city: 'Testville',
        postalCode: '12345',
        country: 'Testland'
      },
      paymentId: 'test'
    });

    const order = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/orders',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(orderBody),
        Authorization: `Bearer ${loginData.token}`
      }
    }, orderBody);

    console.log('ORDER', order.statusCode, order.body);
  } catch (error) {
    console.error('ERROR', error);
  }
})();