import { useState, useEffect, useCallback } from "react";
import { api } from "../utils.js";

// Fetches the video list once on mount. If the URL has a `?v=ID` deep
// link, `initialSelected` resolves to that video once loaded so the
// caller can open it without a page-load flash of the closed gallery.
export function useVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialSelected, setInitialSelected] = useState(null);

  useEffect(() => {
    api('/api/videos').then(v => {
      setVideos(v);
      setLoading(false);
      const params = new URLSearchParams(window.location.search);
      const videoId = params.get('v');
      if (videoId) {
        const match = v.find(vid => vid.id === parseInt(videoId));
        if (match) setInitialSelected(match);
      }
    }).catch(() => setLoading(false));
  }, []);

  const updateVideo = useCallback((updated) => {
    setVideos(prev => prev.map(v => v.id === updated.id ? { ...v, ...updated } : v));
  }, []);

  return { videos, setVideos, loading, initialSelected, updateVideo };
}
