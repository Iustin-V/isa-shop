import React from "react";

export default function FooterSection() {
  return (
    <p className="text-center text-md text-gray-500 py-2">
      <a href="https://redeclipse.ro">
        Built by <span className="font-bold">RedEclipse</span>
      </a>
    </p>
  );
}

export const layout = {
  areaId: "footerBottom",
  sortOrder: 20,
};
