"use client";
import { useState, useEffect, useRef } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import MovieCard from "@/components/MovieCard";
import { useResponsive } from "@/hooks";

interface Movie {
  _id: string;
  title: string;
  publishingYear: number;
  poster: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalMovies: number;
}

/**
 * Home component that displays a list of movies with infinite scroll
 * functionality on small devices and pagination on larger devices.
 *
 * Features:
 * - Fetches and displays a list of movies from the server.
 * - Supports infinite scrolling on small devices and pagination on larger devices.
 * - Allows users to add new movies and edit existing ones.
 * - Provides a logout functionality.
 *
 * The component uses various hooks and states to manage the movie list,
 * loading state, pagination, and responsive design.
 *
 * @returns {JSX.Element} The rendered component.
 */
export default function Home() {
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalMovies: 0,
  });
  const limit = 8;
  const [hasMore, setHasMore] = useState<boolean>(true);

  const router = useRouter();
  const infiniteScrollRef = useRef<HTMLDivElement | null>(null);
  const { isSmallDevice } = useResponsive();

  /**
   * Fetches movies from the server and updates the component state accordingly.
   *
   * Parameters:
   * - `page`: The page number to fetch. Defaults to 1.
   * - `append`: Whether to append the fetched movies to the existing state. Defaults to false.
   *
   * Updates the component state by setting:
   * - `movies`: The list of fetched movies.
   * - `pagination`: The pagination information from the server.
   * - `hasMore`: Whether there are more movies available.
   *
   * Sets `loading` to true before the request and false afterwards.
   *
   * Logs any errors that occur during the request to the console.
   */
  const fetchMovies = async (page: number = 1, append: boolean = false) => {
    setLoading(true);
    try {
      const response = await axios.get("/api/movies", {
        params: { page, limit },
      });
      const fetchedMovies = response.data.movies;

      setMovies((prevMovies) =>
        append ? [...(prevMovies || []), ...fetchedMovies] : fetchedMovies
      );

      setPagination({
        currentPage: response.data.pagination.currentPage,
        totalPages: response.data.pagination.totalPages,
        totalMovies: response.data.pagination.totalMovies,
      });

      setHasMore(page < response.data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Loads more movies by fetching the next page from the server and appending
   * the new movies to the existing state.
   *
   * This function is called when the user reaches the end of the list and there
   * are more movies available. It is also called when the user navigates to a
   * new page and there are more movies available.
   *
   * If there are no more movies available or the component is currently loading,
   * the function does not make the request.
   */
  const loadMoreMovies = () => {
    if (hasMore && !loading) {
      fetchMovies(pagination.currentPage + 1, true);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && isSmallDevice && hasMore && !loading) {
          loadMoreMovies();
        }
      },
      { threshold: 0.1 }
    );

    if (infiniteScrollRef.current) {
      observer.observe(infiniteScrollRef.current);
    }

    return () => {
      if (infiniteScrollRef.current) {
        observer.unobserve(infiniteScrollRef.current);
      }
    };
  }, [isSmallDevice, hasMore, loading]);

  const onAdd = () => {
    router.push("/add");
  };

  /**
   * Fetches movies from the server for the given page number.
   *
   * Parameters:
   * - `page`: The page number to fetch. Must be between 1 and the total number of pages.
   *
   * If the page number is valid, calls `fetchMovies` with the given page number.
   *
   * Does not perform any action if the page number is invalid.
   */
  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchMovies(page);
    }
  };

  /**
   * Logs the user out of the application.
   *
   * Makes a GET request to /api/logout to clear the user's session.
   * If the request is successful, displays a success toast and redirects the user to the login page.
   * If the request fails, displays an error toast.
   */
  const logout = async () => {
    try {
      await axios.get("/api/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (e: unknown) {
      const error = e as AxiosError;
      console.error(error.message);
      toast.error("Logout failed. Please try again.");
    }
  };

  return loading && !movies ? (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg font-medium text-gray-600 animate-pulse">
        Loading...
      </p>
    </div>
  ) : movies && movies?.length > 0 ? (
    <div className="min-h-screen lg:max-w-[1440px] flex items-start justify-center px-[12px] min-[424px]:px-[24px] sm:px-8 md:px-12 lg:px-16 xl:px-24 py-8 md:py-12">
      <div className="grid grid-cols-12 gap-4 w-full">
        {/* Header */}
        <div className="col-span-12 flex items-center justify-between mb-[80px]">
          <div
            className="flex items-center gap-[12px] sm:gap-4 cursor-pointer"
            onClick={onAdd}
          >
            <h2 className="text-white text-[32px] sm:text-[48px] font-[600] leading-[40px] sm:leading-[56px]">
              My Movies
            </h2>
            <Image
              src="/plus.svg"
              alt="Add Movie"
              className="w-[24px] h-[24px] sm:w-[32px] sm:h-[32px] object-contain"
              layout="intrinsic"
              width={24}
              height={24}
            />
          </div>
          <div
            className="flex items-center gap-4 justify-end cursor-pointer"
            onClick={logout}
          >
            <p className="text-white text-[16px] hidden sm:block">Logout</p>
            <Image
              src="/logout.svg"
              alt="Logout"
              className="object-contain"
              layout="intrinsic"
              width={24}
              height={24}
            />
          </div>
        </div>

        {/* Movie List */}
        <div className="flex col-span-12 justify-center items-center flex-wrap min-[424px]:gap-4 gap-2 w-full">
          {movies?.map((movie) => (
            <Link
              key={movie._id}
              href={`/edit/${movie._id}`}
              className="cursor-pointer"
            >
              <MovieCard
                title={movie.title}
                year={movie.publishingYear}
                imageUrl={movie.poster}
              />
            </Link>
          ))}
        </div>

        {/* Infinite Scroll Ref for Small Devices */}
        {isSmallDevice && (
          <div
            ref={infiniteScrollRef}
            className="col-span-12 flex justify-center items-center my-4 text-white"
          >
            {loading && <p>Loading more movies...</p>}
          </div>
        )}

        {/* Pagination for Larger Devices */}
        {!isSmallDevice && (
          <div className="col-span-12 flex items-center justify-center gap-[15px] text-white text-[16px] font-[700] m-4">
            <button
              onClick={() => goToPage(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="cursor-pointer"
            >
              Prev
            </button>
            <div className="flex items-center justify-center gap-[9px]">
              {Array.from({ length: pagination.totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => goToPage(index + 1)}
                  className={`px-3 py-1 rounded-md ${
                    pagination.currentPage === index + 1
                      ? "bg-primary"
                      : "bg-cardColor"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => goToPage(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-[591px] h-[152px] flex flex-col items-center justify-center space-y-[40px]">
        <h2 className="text-white sm:text-[48px] font-[600] sm:leading-[80px] text-center align-center text-[32px] leading-[40px]">
          Your movie list is empty
        </h2>
        <Button
          type="submit"
          width="w-[380px] sm:w-[202px]"
          height="h-[56px] sm:h-[56px]"
          bgColor="bg-primary"
          className="font-[700] text-white text-[16px] py-[16px] px-[28px]"
          onClick={onAdd}
        >
          Add a new movie
        </Button>
      </div>
    </div>
  );
}
