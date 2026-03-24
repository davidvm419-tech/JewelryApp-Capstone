import Navbar from './navbar';

export default function Catalog({ isAuthenticated, username, logoutSuccess }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* user or guest navbar */}
      <Navbar isAuthenticated={isAuthenticated} username={username} logoutSuccess={logoutSuccess} />
      
      {/* Your Product Grid logic continues here */}
      <main className="max-w-7xl mx-auto py-12 px-4">
          <h1 className="text-3xl font-serif text-slate-900 mb-8">Here will go the products!</h1>
      </main>
    </div>
  );
}
