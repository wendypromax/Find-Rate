// src/components/Breadcrumbs.jsx
import React from "react";
import { useLocation, Link } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="text-sm mb-6 font-sans">
      <ol className="flex items-center">
        <li className="flex items-center">
          <Link 
            to="/" 
            className="text-gray-500 hover:text-indigo-600 transition-colors duration-200 flex items-center"
          >
            <span className="text-indigo-400 mr-1">🏠</span>
            Inicio
          </Link>
        </li>
        
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const formattedValue = value.replace(/-/g, " ");

          return (
            <li key={to} className="flex items-center">
              <span className="mx-2 text-gray-300">›</span>
              {isLast ? (
                <span className="text-gray-800 font-medium capitalize">
                  {formattedValue}
                </span>
              ) : (
                <Link 
                  to={to} 
                  className="text-gray-500 hover:text-indigo-600 transition-colors duration-200 capitalize"
                >
                  {formattedValue}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;