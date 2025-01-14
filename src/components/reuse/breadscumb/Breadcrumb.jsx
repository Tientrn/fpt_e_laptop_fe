//

import React from "react";
import { useState } from "react";

const Breadcrumb = () => {
  const [breadcrumbs, setBreadcrumbs] = useState([
    { label: "Home", href: "/" },
  ]);

  const handleAddBreadcrumb = (label, href) => {
    setBreadcrumbs((prev) => [...prev, { label, href }]);
  };
  return (
    <div className="p-4 ml-20">
      {/* Hiển thị Breadcrumb */}
      <ul className="flex items-center space-x-2 text-sm text-blacks">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index} className="flex items-center">
            <a
              href={breadcrumb.href}
              className="text-black hover:text-blue-300 text-sm font-medium"
            >
              {breadcrumb.label}
            </a>
            {index < breadcrumbs.length - 1 && (
              <span className="mx-2 text-gray-400">›</span>
            )}
          </li>
        ))}
      </ul>

      {/* Nút thêm link */}
    </div>
  );
};

export default Breadcrumb;
