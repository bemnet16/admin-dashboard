interface MediaPreviewProps {
  mediaType: string;
  mediaUrl?: string;
}

export function MediaPreview({ mediaType, mediaUrl }: MediaPreviewProps) {
  if (!mediaUrl) return null;

  if (mediaType === "image") {
    return (
      <div className="rounded-md overflow-hidden border my-4">
        <img
          src={mediaUrl || "/placeholder.svg?height=400&width=600"}
          alt="Content"
          className="w-full object-cover max-h-[400px]"
        />
      </div>
    );
  } else if (mediaType === "video") {
    return (
      <div className="rounded-md overflow-hidden border my-4">
        <video
          src={mediaUrl}
          controls
          className="w-full max-h-[400px]"
          poster="/placeholder.svg?height=400&width=600"
        />
      </div>
    );
  }

  return null;
}
