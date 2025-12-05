import React from "react";

type VideoListProps = {
  videos?: {
    id: number;
    title: string;
    description: string;
    slug: string;
    thumbnail?: string;
  }[];
};

export default function VideoList({ videos }: VideoListProps) {
  console.log(videos);
  return (
    <div className="foo-list container mx-auto px-4 py-8">
      <h2 className="font-bold text-center mb-8">Video List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos?.map((video) => (
          <a
            rel="noopener noreferrer"
            key={video.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            href={`/videos/${video.slug}`}
          >
            <img
              src="/img.png"
              alt={video.title}
              className="rounded mb-4 w-full h-48 object-cover"
            />

            <h3 className="font-semibold mb-3 text-gray-800">{video.title}</h3>
            <p className="text-gray-600 leading-relaxed">{video.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 30,
};

export const query = `
  query VideoQuery {
    videos {
      id
      title
      description
      slug
    }
  }
`;
