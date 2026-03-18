import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { getTopMovies } from "@/lib/appwrite";
import type { TopMovieRow } from "@/lib/appwrite";
import Autoplay from "embla-carousel-autoplay";

export function TrendingCarousel() {
  const [movies, setMovies] = useState<TopMovieRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      const trendingMovies = await getTopMovies();
      setMovies(trendingMovies);
      setLoading(false);
    };
    fetchTrendingMovies();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full px-20 py-5">
        Loading...
      </div>
    );
  }

  return (
    <div className="">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            stopOnInteraction: false,
            stopOnLastSnap: false,
            delay: 3000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="">
          {movies.map((movie) => (
            <CarouselItem
              key={movie.$id}
              className="py-5 basis-[45%] xs:basis-[45%] sm:basis-[30%] md:basis-[30%] lg:basis-[21%] pl-4"
            >
              <Card className="h-full border-0 hover:scale-90 transition-scale duration-300 group overflow-hidden">
                <CardContent className="relative flex aspect-2/3 items-center justify-center p-0 overflow-hidden rounded-xl">
                  <img
                    src={movie.poster_url}
                    alt={movie.search_term}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-black/40 backdrop-blur-md flex items-center justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
                    <p className="text-white font-bold tracking-wider">shaik</p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:flex">
          <CarouselPrevious className="md:-left-12 lg:-left-16" />
          <CarouselNext className="md:-right-14 lg:-right-18" />
        </div>
      </Carousel>
    </div>
  );
}
