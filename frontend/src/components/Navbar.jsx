import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-6">
        <li>
          <NavLink
            to="/purchase"
            className={({ isActive }) =>
              isActive ? "underline font-semibold" : "hover:underline"
            }
          >
            Purchase
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/usage"
            className={({ isActive }) =>
              isActive ? "underline font-semibold" : "hover:underline"
            }
          >
            Usage
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/stock"
            className={({ isActive }) =>
              isActive ? "underline font-semibold" : "hover:underline"
            }
          >
            Stock
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
