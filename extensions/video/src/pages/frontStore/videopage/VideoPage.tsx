import React, { Fragment } from "react";
export default function VideoPage({ video }) {
  if (!video) {
    return <div className="container mx-auto p-8">Video not found</div>;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto w-fit">
        <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
        {video.url ? (
          <video
            className="rounded mb-4 w-full max-h-[558px]"
            src={video.url}
            controls
          />
        ) : (
          <div className="relative rounded overflow-hidden">
            <img
              src="/img.png"
              alt={video.title}
              className="w-full max-h-[558px] object-cover"
            />
            <div className="flex flex-col absolute inset-0 bg-black/60 flex items-center justify-center">
              <p className="text-white text-2xl font-semibold text-center px-6">
                You need an active subscription to see this video
              </p>
              <a
                href="/accessories"
                className="text-blue-400 hover:text-blue-600 text-2xl font-semibold text-center px-6"
              >
                Buy one now
              </a>
            </div>
          </div>
        )}
        <p className="text-gray-600 mb-6">{video.description}</p>
      </div>
    </div>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 30,
};

export const query = `
  query VideoQuery($slug: String) {
    video(slug: getContextValue('videoSlug')) {
      id
      title
      description
      url
    }
  }
`;
