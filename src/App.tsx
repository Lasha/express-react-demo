import React, { useState, useEffect } from 'react';
import { Server, User, ShoppingBag, AlertTriangle } from 'lucide-react';

// Define types for our data
type ApiMessage = {
  message: string;
};

type UserData = {
  id: number;
  name: string;
  email: string;
  role: string;
  skills: string[];
  experience: number;
  location: string;
  department: string;
  projects: number;
};

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
};

// Fallback data for when API is not available
const FALLBACK_DATA = {
  message: "API not available in production. This is fallback data.",
  user: {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Developer',
    skills: ['JavaScript', 'React', 'Node.js', 'Express'],
    experience: 5,
    location: 'San Francisco',
    department: 'Engineering',
    projects: 12
  },
  products: [
    { id: 1, name: 'Laptop Pro', price: 1299, category: 'Electronics', inStock: true },
    { id: 2, name: 'Wireless Headphones', price: 199, category: 'Audio', inStock: true },
    { id: 3, name: 'Smart Watch', price: 349, category: 'Wearables', inStock: false },
    { id: 4, name: 'Desk Chair', price: 249, category: 'Furniture', inStock: true },
    { id: 5, name: 'Coffee Maker', price: 89, category: 'Kitchen', inStock: true },
    { id: 6, name: 'Fitness Tracker', price: 129, category: 'Wearables', inStock: true }
  ]
};

function App() {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'welcome' | 'user' | 'products'>('welcome');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [userLoading, setUserLoading] = useState<boolean>(false);
  const [productsLoading, setProductsLoading] = useState<boolean>(false);
  const [isApiAvailable, setIsApiAvailable] = useState<boolean>(true);
  const [isNetlify, setIsNetlify] = useState<boolean>(false);

  // Helper function to safely fetch data with timeout
  const fetchWithTimeout = async (url: string, options = {}, timeout = 5000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  };

  useEffect(() => {
    // Check if we're on Netlify or another deployment platform by looking at the hostname
    if (window.location.hostname.includes('netlify.app') || 
        window.location.hostname.includes('staticblitz.com')) {
      setIsNetlify(true);
      setIsApiAvailable(false);
      setMessage(FALLBACK_DATA.message);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetchWithTimeout('/api/hello', {}, 3000);
        const data = await response.json();
        setMessage(data.message);
        setIsApiAvailable(true);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage(FALLBACK_DATA.message);
        setIsApiAvailable(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchUserData = async () => {
    if (userData) return; // Don't fetch if we already have data
    
    setUserLoading(true);
    try {
      if (!isApiAvailable) {
        // Simulate delay with fallback data
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUserData(FALLBACK_DATA.user);
      } else {
        const response = await fetchWithTimeout('/api/user', {}, 3000);
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Use fallback data if API fails
      setUserData(FALLBACK_DATA.user);
      setIsApiAvailable(false);
    } finally {
      setUserLoading(false);
    }
  };

  const fetchProducts = async () => {
    if (products.length > 0) return; // Don't fetch if we already have data
    
    setProductsLoading(true);
    try {
      if (!isApiAvailable) {
        // Simulate delay with fallback data
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProducts(FALLBACK_DATA.products);
      } else {
        const response = await fetchWithTimeout('/api/products', {}, 3000);
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Use fallback data if API fails
      setProducts(FALLBACK_DATA.products);
      setIsApiAvailable(false);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'user') {
      fetchUserData();
    } else if (activeTab === 'products') {
      fetchProducts();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md max-w-4xl w-full">
        <div className="flex items-center justify-center p-6 border-b border-gray-200">
          <Server className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">Express + React App</h1>
        </div>
        
        {!isApiAvailable && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Note:</strong> {isNetlify ? 
                    "This app is deployed on a static hosting platform, which doesn't support running the Express server. Showing simulated data instead." : 
                    "The Express API is not available. Showing fallback data instead."}
                </p>
                {isNetlify && (
                  <p className="text-sm text-yellow-700 mt-1">
                    To see the real API in action, clone the repository and run the app locally with both the React frontend and Express backend.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-3 font-medium text-sm flex items-center ${
              activeTab === 'welcome' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('welcome')}
          >
            <Server className="h-4 w-4 mr-2" />
            Welcome
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm flex items-center ${
              activeTab === 'user' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('user')}
          >
            <User className="h-4 w-4 mr-2" />
            User Object
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm flex items-center ${
              activeTab === 'products' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('products')}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Products Array
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'welcome' && (
            <div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                <h2 className="text-lg font-semibold mb-2">Server Response:</h2>
                {loading ? (
                  <div className="flex items-center justify-center h-10">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <p className="text-gray-700">{message}</p>
                )}
              </div>
              
              <div className="text-sm text-gray-600">
                <p className="mb-2">Your Express + React app is now set up with:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>React frontend with Tailwind CSS</li>
                  <li>Express backend API with multiple endpoints</li>
                  <li>API proxy configuration</li>
                  <li>Concurrent development servers</li>
                  {isNetlify && <li>Fallback data for static hosting deployment</li>}
                </ul>
              </div>
            </div>
          )}
          
          {activeTab === 'user' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">User Object Data</h2>
              {userLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : userData ? (
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-gray-700">Name</h3>
                      <p className="text-gray-900">{userData.name}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Email</h3>
                      <p className="text-gray-900">{userData.email}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Role</h3>
                      <p className="text-gray-900">{userData.role}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Department</h3>
                      <p className="text-gray-900">{userData.department}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Experience</h3>
                      <p className="text-gray-900">{userData.experience} years</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Location</h3>
                      <p className="text-gray-900">{userData.location}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Projects</h3>
                      <p className="text-gray-900">{userData.projects}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Skills</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {userData.skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Failed to load user data</p>
              )}
            </div>
          )}
          
          {activeTab === 'products' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Products Array Data</h2>
              {productsLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : products.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{product.category}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">Failed to load products data</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;