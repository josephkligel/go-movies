import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Input from "./form/Input";

const GraphQL = () => {
  // setup stateful variables
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fullList, setFullList] = useState([]);

  // Perform search
  const performSearch = () => {
    // setMovies(
    //   fullList.filter(item => {
    //     return item.toLowerCase().includes(searchTerm.toLowerCase())
    //   })
    // )
    const payload = `
      {
        search(titleContains: "${searchTerm}"){
          id
          title
          runtime
          release_date
          mpaa_rating
        }
      }`;

    const headers = new Headers();
    headers.append("Content-Type", "application/graphql");

    const reqOpt = {
      method: "POST",
      headers: headers,
      body: payload,
    };

    fetch(`/graph`, reqOpt)
      .then((resp) => resp.json())
      .then((resp) => {
        let theList = Object.values(resp.data.search);
        setMovies(theList);
      })
      .catch(err => console.log(err))
  };

  const handleChange = (event) => {
    event.preventDefault();

    let value = event.target.value;

    setSearchTerm(value);

    if (value.length > 2) {
      performSearch();
    } else {
      setMovies(fullList);
    }
  };

  // useEffect
  useEffect(() => {
    const payload = `
      {
        list {
          id
          title
          runtime
          release_date
          mpaa_rating
        }
      }`;

    const headers = new Headers();
    headers.append("Content-Type", "application/graphql");

    const reqOpt = {
      method: "POST",
      headers: headers,
      body: payload,
    };

    fetch(`/graph`, reqOpt)
      .then((resp) => resp.json())
      .then((resp) => {
        let theList = Object.values(resp.data.list);
        setMovies(theList);
        setFullList(theList);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h2>GraphQL</h2>
      <hr />

      <form onSubmit={handleChange}>
        <Input
          title={"Search"}
          type={"search"}
          name={"search"}
          className="form-control"
          value={searchTerm}
          onChange={handleChange}
        />
      </form>

      {movies ? (
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Movie</th>
              <th>Release Date</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((m) => (
              <tr key={m.id}>
                <td>
                  <Link to={`/movies/${m.id}`}>{m.title}</Link>
                </td>
                <td>{new Date(m.release_date).toLocaleDateString()}</td>
                <td>{m.mpaa_rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No movies (yet)!</p>
      )}
    </div>
  );
};

export default GraphQL;
