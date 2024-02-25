import { useState, useEffect, useRef } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useKeyPressEvent } from "./useKeyPressEvent";

const average = (arr) =>
    arr.reduce((acc, cur, _, arr) => acc + cur / arr.length, 0);

const KEY = "e7a4eaff";

export default function App() {
    const [watched, setWatched] = useState([]);
    const [selectedID, setSelectedID] = useState("");
    const [query, setQuery] = useState("");
    const {movies, loading, error} = useMovies(query);

    const handleSelectedMovie = id => setSelectedID(cId => cId === id ? "" : id);
    const handleCloseDetails = () => setSelectedID("");
    const handleAddWatch = (movie) => setWatched(watched => [...watched, movie]);
    const handleDeleteWatched = (id) => setWatched(watched => watched.filter(mov => mov.imdbID !== id))

    return (
        <>
            <NavBar>
                <SearchBar query={query} setQuery={setQuery} />
                <NumResults movies={movies} />
            </NavBar>
            <Main>
                <Box>
                    {loading ? <Loading /> : error ? <ErrorMessage message={error} /> : <MoviesList movies={movies} onClick={handleSelectedMovie} />}
                </Box>
                <Box>
                    {
                        selectedID
                            ? (
                                <MovieDetails id={selectedID} onCloseDetails={handleCloseDetails} onAddWatch={handleAddWatch} watchedList={watched} />
                            )
                            : (
                                <>
                                    <WatchedMovieSummary watched={watched} />
                                    <WatchedMoviesList watched={watched} onDeleteWatched={handleDeleteWatched} />
                                </>
                            )
                    }
                </Box>
            </Main>
        </>
    );
}

function Loading() {
    return (
        <p className="loader">Loading ...</p>
    );
}

function ErrorMessage({ message }) {
    return (
        <p className="error">{message}</p>
    );
}

function Logo() {
    return (
        <div className="logo">
            <span role="img">🍿</span>
            <h1>usePopcorn</h1>
        </div>
    );
}

function SearchBar({ query, setQuery }) {
    const sbar = useRef();
    useKeyPressEvent("enter", () => {
        if (document.activeElement === sbar.current)
            return;
        sbar.current.focus();
        // setQuery("");
    })
    useKeyPressEvent("escape", () => {
        sbar.current.blur();
    })

    return (
        <input
            className="search"
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            ref={sbar}
        />
    );
}

function NumResults({ movies }) {
    return (
        <p className="num-results">
            Found <strong>{movies.length}</strong> results
        </p>
    );
}

function NavBar({ children }) {
    return (
        <nav className="nav-bar">
            <Logo />
            {children}
        </nav>
    );
}

function Main({ children }) {
    return (
        <main className="main">
            {children}
        </main>
    );
}

function MovieDetails({ id, onCloseDetails, onAddWatch, watchedList }) {
    const [details, setDetails] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [userRating, setUserRating] = useState(0);

    const isWatched = watchedList.map(mov => mov.imdbID).includes(id);
    const watchedUserRating = watchedList.find(mov => mov.imdbID === id)?.userRating;
    const handleAdd = () => {
        const watchedMovie = {
            imdbID: id,
            title,
            year,
            poster,
            userRating,
            imdbRating: Number(imdbRating),
            runtime: Number(runtime.split(" ").at(0)),
        };

        onAddWatch(watchedMovie);
        onCloseDetails();
    }

    const {
        Title: title,
        Year: year,
        Poster: poster,
        Runtime: runtime,
        imdbRating,
        Plot: plot,
        Released: released,
        Actors: actors,
        Director: director,
        Genre: genre,
    } = details;

    useKeyPressEvent("escape", onCloseDetails);

    useEffect(() => {
        const fetchDetails = async () => {
            setIsLoading(true);
            const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${id}`);
            const data = await res.json();
            setDetails(data);
            setIsLoading(false);
        }
        fetchDetails();
    }, [id]);

    useEffect(() => {
        if (!title) return;
        document.title = `Movie: ${title}`;

        return () => document.title = "usePopcorn";
    }, [title])

    return (
        <div className="details">
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <header>
                        <button className="btn-back" onClick={onCloseDetails}>
                            &larr;
                        </button>
                        <img src={poster} alt={`Poster of ${title} movie`} />
                        <div className="details-overview">
                            <h2>{title}</h2>
                            <p>
                                {released} &bull; {runtime}
                            </p>
                            <p>{genre}</p>
                            <p>
                                <span>⭐️</span>
                                {imdbRating} IMDb rating
                            </p>
                        </div>
                    </header>
                    <section>
                        <div className="rating">
                            {!isWatched ? (
                                <>
                                    <StarRating
                                        maxRating={10}
                                        size={24}
                                        onSetRating={setUserRating}
                                    />
                                    {userRating > 0 && (
                                        <button className="btn-add" onClick={handleAdd}>
                                            + Add to list
                                        </button>
                                    )}
                                </>
                            ) : (
                                <p>
                                    You rated this movie with {watchedUserRating} <span>⭐️</span>
                                </p>
                            )}
                        </div>
                        <p>
                            <em>{plot}</em>
                        </p>
                        <p>Starring {actors}</p>
                        <p>Directed by {director}</p>
                    </section>
                </>
            )}
        </div>
    );
}

function MoviesList({ movies, onClick }) {
    return (
        <ul className="list list-movies">
            {movies?.map((movie) => (
                <li key={movie.imdbID} onClick={() => onClick(movie.imdbID)}>
                    <img src={movie.Poster} alt={`${movie.Title} poster`} />
                    <h3>{movie.Title}</h3>
                    <div>
                        <p>
                            <span>🗓</span>
                            <span>{movie.Year}</span>
                        </p>
                    </div>
                </li>
            ))}
        </ul>
    );
}

function Box({ children }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="box">
            <button
                className="btn-toggle"
                onClick={() => setIsOpen((open) => !open)}
            >
                {isOpen ? "–" : "+"}
            </button>
            {isOpen && children}
        </div>
    );
}

function WatchedMovieSummary({ watched }) {
    const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
    const avgUserRating = average(watched.map((movie) => movie.userRating));
    const avgRuntime = average(watched.map((movie) => movie.runtime));

    return (
        <div className="summary">
            <h2>Movies you watched</h2>
            <div>
                <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                </p>
                <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating.toFixed(2)}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{avgUserRating.toFixed(2)}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{avgRuntime.toFixed(2)} min</span>
                </p>
            </div>
        </div>
    );
}

function WatchedMoviesList({ watched, onDeleteWatched }) {
    return (
        <ul className="list">
            {watched.map((movie) => (
                <li key={movie.imdbID}>
                    <img src={movie.poster} alt={`${movie.title} poster`} />
                    <h3>{movie.title}</h3>
                    <div>
                        <p>
                            <span>⭐️</span>
                            <span>{movie.imdbRating}</span>
                        </p>
                        <p>
                            <span>🌟</span>
                            <span>{movie.userRating}</span>
                        </p>
                        <p>
                            <span>⏳</span>
                            <span>{movie.runtime} min</span>
                        </p>
                        <button className="btn-delete" onClick={() => onDeleteWatched(movie.imdbID)}>
                            X
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}
