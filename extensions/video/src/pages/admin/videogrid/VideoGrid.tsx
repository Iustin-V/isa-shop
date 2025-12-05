import React from "react";

export default function VideoGrid({ videos }) {
  return (
    <div className="admin-content p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Videos</h1>

        <a href="/admin/videos/new" className="button primary">
          Add Video
        </a>
      </div>
      <div className="card shadow">
        <table className="listing sticky">
          <thead>
            <tr>
              <th className="column">
                <div className="font-medium uppercase text-xs">Title</div>
              </th>{" "}
              <th className="column">
                <div className="font-medium uppercase text-xs">description</div>
              </th>{" "}
              <th className="column">
                <div className="font-medium uppercase text-xs">Slug</div>
              </th>{" "}
              <th className="column">
                <div className="font-medium uppercase text-xs">Filename</div>
              </th>{" "}
              <th className="column">
                <div className="font-medium uppercase text-xs">Status</div>
              </th>{" "}
              <th className="column">
                <div className="font-medium uppercase text-xs"></div>
              </th>
            </tr>
          </thead>

          <tbody>
            {videos?.map((video) => (
              <tr key={video.id}>
                <td>
                  {" "}
                  <a
                    href={`/admin/videos/edit/${video.id}`}
                    className="hover:underline font-semibold"
                  >
                    {video.title}
                  </a>
                </td>
                <td>{video.description}</td>
                <td>{video.slug}</td>
                <td>{video.filename}</td>
                <td>{video.is_active ? "Active" : "Inactive"}</td>

                <td>
                  <a
                    href={`/admin/videos/edit/${video.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 10,
};

export const query = `
  query VideoQuery {
    videos(showInactive: true) {
      id
      title
      description
      slug
      filename
      is_active
    }
  }
`;
