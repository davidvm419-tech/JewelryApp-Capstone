import Navbar from './navbar';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCatalog } from '../utils';



export default function Catalog({ isAuthenticated, username, logoutSuccess }) {
  // Set states for products
  // Get back end information
  // Display information
  // Get pagination 
  // Create pagination component with tailwind

  return (
    <div className="min-h-screen bg-slate-50">
      {/* navbar*/}
      <Navbar isAuthenticated={isAuthenticated} username={username} logoutSuccess={logoutSuccess} />
      
      {/* Catalog content*/}
      <main className="max-w-7xl mx-auto py-12 px-4">
        <div>
          <h1 className="text-3xl font-serif text-slate-900 mb-8">title</h1>
        </div>
      </main>
    </div>
  );
}
