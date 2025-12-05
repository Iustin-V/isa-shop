import React from "react";

export default function AdminVideoMenu() {
  return (
    <li className="nav-item">
      <a href="/admin/videos" className="flex justify-left">
        <i className="menu-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path d="M10 3H0V13H10V3Z" fill="#000000" />
            <path d="M15 3L12 6V10L15 13H16V3H15Z" fill="#000000" />
          </svg>{" "}
        </i>{" "}
        Videos
      </a>
    </li>
  );
}

export const layout = {
  areaId: "catalogMenuGroup",
  sortOrder: 50,
};
