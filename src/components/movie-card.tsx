import {
  Card,
  CardContent,
  CardFooter,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import star from "../assets/star.svg";

type Movie = {
  title: string;
  release_date: string;
  poster_path: string;
  vote_average: number;
};
const MovieCard = ({ movie }: { movie: Movie }) => {
  const { title, release_date, poster_path, vote_average } = movie;
  return (
    <Card className="max-w-50 shadow-2xs hover:cursor-pointer hover:scale-103 hover:shadow-xl transition-all duration-200">
      <div className="absolute z-10 bg-sidebar flex m-2 px-2 py-1 rounded-xl gap-1 items-center">
        <img src={star} className="h-4"></img> <p>{vote_average.toFixed(1)}</p>
      </div>
      <CardContent className=" hover:scale-103 transition-transform duration-600 ">
        <img
          src={`https://image.tmdb.org/t/p/w600_and_h900_face${poster_path}`}
          alt={title}
          className="aspect-2/3 rounded-t-xl object-cover"
        />
      </CardContent>
      <CardFooter className="hover:bg-accent/20">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{release_date}</CardDescription>
      </CardFooter>
    </Card>
  );
};

export default MovieCard;
