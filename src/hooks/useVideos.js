import { useState, useEffect, useCallback } from "react";
import { api } from "../utils.js";

// Fetches the video list once on mount. Which video (if any) is "open"
// is driven by the router (see ClownDanceGallery.jsx's /video/:id route),
// not by this hook.
export function useVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/api/videos').then(v => {
      setVideos(v);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const updateVideo = useCallback((updated) => {
    setVideos(prev => prev.map(v => v.id === updated.id ? { ...v, ...updated } : v));
  }, []);

  return { videos, setVideos, loading, updateVideo };
}
