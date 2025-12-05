import React, { useState } from "react";

export default function VideoEditPage(props) {
  const video = props.videoById;
  const [form, setForm] = useState({
    title: video.title,
    slug: video.slug,
    description: video.description || "",
    is_active: video.is_active,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      let finalFilename = video.filename;
      if (selectedFile) {
        const data = new FormData();
        data.append("video", selectedFile);

        const uploadRes = await fetch("/api/admin/video/upload", {
          method: "POST",
          body: data,
        });

        const uploadJson = await uploadRes.json();

        if (!uploadJson.success) {
          alert("Video upload failed");
          setSaving(false);
          return;
        }

        finalFilename = uploadJson.filename;
      }

      const updateRes = await fetch(`/api/admin/video/update/${video.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          filename: finalFilename,
        }),
      });

      if (updateRes.ok) {
        window.location.href = "/admin/videos";
      } else {
        alert("Failed to update video");
      }

      setSaving(false);
    } catch (e) {
      console.error("Error updating video", e);
      alert("Failed to save video");
    }
  }

  return (
    <div className="admin-content p-8 max-w-4xl">
      <div className="flex flex-row justify-between items-center mb-6">
        {" "}
        <h1 className="text-3xl font-semibold ">Edit Video</h1>
        <button
          type="button"
          className="button danger"
          onClick={() => {
            if (confirm("Are you sure you want to delete this video?")) {
              fetch(`/api/admin/video/delete/${video.id}`, {
                method: "DELETE",
              })
                .then((res) => {
                  if (res.ok) {
                    window.location.href = "/admin/videos";
                  } else {
                    alert("Failed to delete video");
                  }
                })
                .catch(() => alert("Failed to delete video"));
            }
          }}
        >
          Delete Video
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">General</h2>

            <div className="mb-4">
              <label className="block font-medium mb-1">Title *</label>
              <input
                name="title"
                className="border border-[#d1d5db] rounded p-2 w-full"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1">Slug</label>
              <input
                name="slug"
                className="border border-[#d1d5db] rounded p-2 w-full"
                value={form.slug}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1">Description</label>
              <textarea
                name="description"
                className="border border-[#d1d5db] rounded p-2 w-full"
                rows={4}
                value={form.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Active</label>
            <select
              name="is_active"
              className="border border-[#d1d5db] rounded p-2 w-full"
              value={form.is_active ? "true" : "false"}
              onChange={(e) =>
                setForm({
                  ...form,
                  is_active: e.target.value === "true",
                })
              }
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">Video Upload</h2>
            <div className="border border-gray-300 rounded p-4 space-y-2">
              <p className="text-gray-700 mb-2">
                Current video file: <strong>{video.filename}</strong>
              </p>

              {selectedFile ? (
                <p className="text-green-700">
                  New file selected: <strong>{selectedFile.name}</strong>
                </p>
              ) : (
                <p className="text-gray-500">
                  (Optional) Upload a new file to replace the current one.
                </p>
              )}

              <input
                type="file"
                accept="video/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>
        </div>
        <div className="form-submit-button flex border-t border-divider mt-4 pt-4 justify-between">
          <a href="/admin/videos" className="button danger outline">
            <span>Cancel</span>
          </a>

          <button type="submit" className="button primary" disabled={saving}>
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 10,
};

// GraphQL Query
export const query = `
  query VideoEditQuery ($id: ID!) {
    videoById(id: getContextValue("videoId")) {
      id
      title
      slug
      description
      filename
      is_active
    }
  }
`;
