import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle.tsx";
import { AuroraBackground } from "@/components/aurora-background.tsx";
import { CarouselSpacing } from "./components/carousel-spacing";
//import { Button } from "@/components/ui/button";
import { SearchBox } from "./components/search";
import { useEffect, useState } from "react";
import MovieCard from "./components/movie-card";
import { useDebounce } from "react-use";

const API_BASE_URL = "https://api.themoviedb.org/3/discover/movie";
const API_BASE_URL_SEARCH = "https://api.themoviedb.org/3/search/movie";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: { accept: "application/json", Authorization: `Bearer ${API_KEY}` },
};
export function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movieList, setmovieList] = useState([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 500, [searchTerm]);

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
            <div className="">{/* <CarouselSpacing /> */}</div>
            <div className="">
              <h3 className="text-5xl font-bold text-center">Find Rate Like</h3>
              <h3 className="text-5xl font-bold text-center">Movies</h3>
            </div>
            <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
        </header>
        <main className="bg-linear-to-b from-10% via-muted via-50% to-accent/40">
          <section className="px-6 mx-auto pb-10 max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-350 md:px-10">
            <h3 className="text-5xl py-10">Top Movies</h3>
            <ul className="grid grid-cols-2 gap-y-5 gap-x-3  md:gap-x-5 justify-center md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {movieList.map((movie) => (
                <div key={movie.id} className="">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </ul>
          </section>
        </main>
        <footer></footer>
      </ThemeProvider>
    </>
  );
}

export default App;
