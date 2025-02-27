import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to simulate delay
const simulateDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// API routes with simulated delay
app.get('/api/hello', async (req, res) => {
  await simulateDelay(1000); // 1 second delay
  res.json({ message: 'Hello from Express server!' });
});

// New endpoint that returns an object with delay
app.get('/api/user', async (req, res) => {
  await simulateDelay(2000); // 2 second delay
  res.json({
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Developer',
    skills: ['JavaScript', 'React', 'Node.js', 'Express'],
    experience: 5,
    location: 'San Francisco',
    department: 'Engineering',
    projects: 12
  });
});

// New endpoint that returns an array with delay
app.get('/api/products', async (req, res) => {
  await simulateDelay(3000); // 3 second delay
  res.json([
    { id: 1, name: 'Laptop Pro', price: 1299, category: 'Electronics', inStock: true },
    { id: 2, name: 'Wireless Headphones', price: 199, category: 'Audio', inStock: true },
    { id: 3, name: 'Smart Watch', price: 349, category: 'Wearables', inStock: false },
    { id: 4, name: 'Desk Chair', price: 249, category: 'Furniture', inStock: true },
    { id: 5, name: 'Coffee Maker', price: 89, category: 'Kitchen', inStock: true },
    { id: 6, name: 'Fitness Tracker', price: 129, category: 'Wearables', inStock: true }
  ]);
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const distPath = join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  
  app.get('*', (req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});