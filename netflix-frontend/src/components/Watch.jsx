import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Watch = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/movies/${id}`
        );
        setMovie(res.data);
      } catch (err) {
        console.error("Movie fetch failed");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) return <div className="text-white">Loading...</div>;
  if (!movie) return <div className="text-white">Movie not found</div>;

  return (
    <div className="w-screen h-screen bg-black">
      <video
        className="w-full h-full"
        controls
        autoPlay
        src={movie.videoUrl}   // 🎬 Cloudinary URL
      />
    </div>
  );
};

export default Watch;