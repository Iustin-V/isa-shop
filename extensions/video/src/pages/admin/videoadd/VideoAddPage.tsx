import React, { useState } from "react";

export default function VideoAddPage() {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    is_active: false,
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
      let finalFilename = null;

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
      } else {
        alert("Please upload a video file");
        setSaving(false);
        return;
      }

      const createRes = await fetch("/api/admin/video/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          filename: finalFilename,
        }),
      });

      if (createRes.ok) {
        window.location.href = "/admin/videos";
      } else {
        alert("Failed to save video");
      }

      setSaving(false);
    } catch (e) {
      console.error(`Error creating video: ${e}`);
      alert("Failed to save video");
    }
  }

  return (
    <div className="admin-content p-8 max-w-4xl">
      <h1 className="text-3xl font-semibold mb-6">Create New Video</h1>

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
                placeholder="auto-generated from title"
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
            <div className="border border-gray-300 rounded p-4">
              {!selectedFile ? (
                <p className="text-gray-500 mb-3">
                  Choose a video to upload on save.
                </p>
              ) : (
                <p className="text-green-700 mb-3">
                  File selected: <strong>{selectedFile.name}</strong>
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
          <button type="button" className="button danger outline">
            <span>Cancel</span>
          </button>
          <button type="submit" className="button primary" disabled={saving}>
            <span> {saving ? "Saving..." : "Save Video"}</span>
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
