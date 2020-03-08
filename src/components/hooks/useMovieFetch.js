import { useState, useEffect, useCallback } from 'react';
import { API_URL, API_KEY } from '../../config';

export const useMovieFetch = movieID => {
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = useCallback(async () => {
    setError(false);
    setLoading(true);

    try {
      const endpoint = `${API_URL}movie/${movieID}?api_key=${API_KEY}`;
      const result = await (await fetch(endpoint)).json();

      const creditsEndpoint = `${API_URL}movie/${movieID}/credits?api_key=${API_KEY}`;
      const creditsResult = await (await fetch(creditsEndpoint)).json();

      const directors = creditsResult.crew.filter(
        member => member.job === 'Director'
      );

      setState({
        ...result,
        actors: creditsResult.cast,
        directors,
      })

    } catch(error){
      setError(true);
    }
    setLoading(false);
  }, [movieID])

  useEffect(() => {
    if(localStorage[movieID]) {
      setState(JSON.parse(localStorage[movieID]));
      setLoading(false);
    } else {
      fetchData();
    }
  }, [fetchData, movieID])

  useEffect(() =>{
    localStorage.setItem(movieID, JSON.stringify(state));
  }, [movieID, state])

  return [state, loading, error];
}
