import Layout from './components/Layout'

function App() {
  return (
    <Layout>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome to Financial Agent</h2>
        <p className="text-gray-600">
          Your personal finance management assistant.
        </p>
      </div>
    </Layout>
  )
}

export default App
