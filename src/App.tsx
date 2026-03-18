import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle.tsx";
import { AuroraBackground } from "@/components/aurora-background.tsx";
import { TrendingCarousel } from "./components/trending-carosel";

//import { Button } from "@/components/ui/button";
import { SearchBox } from "./components/search";
import { useEffect, useState } from "react";
import MovieCard from "./components/movie-card";
import { useDebounce } from "react-use";
import {
  client,
  updateSearchcount,
} from "./lib/appwrite";

const API_BASE_URL = "https://api.themoviedb.org/3/discover/movie";
const API_BASE_URL_SEARCH = "https://api.themoviedb.org/3/search/movie";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: { accept: "application/json", Authorization: `Bearer ${API_KEY}` },
};

type Movie = {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  vote_average: number;
};

export function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movieList, setmovieList] = useState<Movie[]>([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Ping Appwrite backend on app initialization
  useEffect(() => {
    client
      .ping()
      .then(() => {
        console.log("✓ Appwrite connection successful");
      })
      .catch((error) => {
        console.error("✗ Appwrite connection failed:", error);
      });
  }, []);

  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
    },
    500,
    [searchTerm],
  );

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const fetchMovies = async (query = "") => {
    try {
      const endpoint = query
        ? `${API_BASE_URL_SEARCH}?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`
        : `${API_BASE_URL}?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let data = await response.json();

      if (data.success == false) {
        setmovieList([]);
        throw new Error(
          `API error! status: ${data.status_code}, message: ${data.status_message}`,
        );
      }

      setmovieList(data.results);

      if (query && data.results.length > 0) {
        const movie = data.results[0];
        await updateSearchcount(query, movie);
      }
    } catch (error) {
      alert("ERROR: " + error);
    }
  };

  return (
    <>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <ModeToggle />
        <header>
          <div className="inset-0 absolute -z-10">
            <AuroraBackground />
          </div>
          <div className="flex flex-col items-center p-5 gap-20">
            <div>{/* <CarouselSpacing /> */}</div>
            <div className="">
              <h3 className="text-3xl text-center">Find Rate Like</h3>
              <h3 className="text-6xl text-transparent font-bold bg-clip-text bg-linear-to-r from-cyan-500 to-blue-600 text-center">
                Movies
              </h3>
            </div>
            <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
        </header>
        <main className="bg-linear-to-b from-10% via-muted via-50% to-accent/40 pb-20">
          <section className="max-w-7xl mx-auto px-6 md:px-20 lg:px-24">
            <h3 className="text-5xl py-10">Trending</h3>
            <TrendingCarousel />
            <div className="mt-10">
              <h3 className="text-5xl py-10 uppercase">Latest Hits</h3>
              <ul className="grid grid-cols-2 gap-y-5 gap-x-3 md:gap-x-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {movieList.map((movie: Movie) => (
                  <div key={movie.id}>
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </ul>
            </div>
          </section>
        </main>
        <footer></footer>
      </ThemeProvider>
    </>
  );
}

export default App;
