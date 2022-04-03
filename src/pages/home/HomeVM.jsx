import { useState } from "react";
import { BASE_URL } from "../../utils/constants";

function HomeVM() {
  const getItemFromLocalStorage = (item) => {
    const localStorageItem = localStorage.getItem(item);
    const parsedItem = JSON.parse(localStorageItem);
    return parsedItem;
  };

  const [joke, setJoke] = useState({});
  const [likedJokes, setLikedJokes] = useState(
    getItemFromLocalStorage("likedJokes") || {}
  );
  const [deslikedJokes] = useState({});
  const [showLikedJokes, setShowLikedJokes] = useState(false);
  const [category, setCategory] = useState(
    getItemFromLocalStorage("category") || ""
  );
  const [language, setLanguage] = useState(
    getItemFromLocalStorage("language") || ""
  );
  const [type, setType] = useState(getItemFromLocalStorage("type") || "");
  // const [numOdRetries, setNumOdRetries] = useState(0);
  // const [error, setError] = useState(null);

  let numOdRetries = 0;

  //   category: "Spooky"
  //   delivery: "So they can keep their ghoulish figures."
  //   error: false
  //   flags: {nsfw: false, religious: false, political: false, racist: false, sexist: false, …}
  //   id: 295
  //   lang: "en"
  //   safe: true
  //   setup: "Why do ghosts go on diets?"
  //   type: "twopart"

  // https://github.com/edvaldo-domingos/ombu-react
  // https://trello.com/b/uray9LjG/codename-joker-edvaldo
  // https://www.leighhalliday.com/mock-fetch-jest

  const mapJokeResponseFromApi = (joke) => {
    switch (joke.type) {
      case "twopart":
        setJoke({ ...joke, description: `${joke.setup}, ${joke.delivery}` });
        break;
      default:
        setJoke({ ...joke, description: joke.joke });
        break;
    }
  };

  const fetchRandomJoke = async () => {
    try {
      // https://v2.jokeapi.dev/joke/Misc,Programming?format=xml&safe-mode&type=single
      let url = `${BASE_URL}`;

      if (category) {
        url += `${category}`;
      } else {
        url += "Any";
      }

      if (language) {
        url += `${"?lang=" + language}`;
      }

      if (type) {
        url += `${language ? "&" : "?"}type=${type}`;
      }

      url += `${language || type ? "&" : "?"}safe-mode`;

      console.log(url);

      const response = await fetch(url);
      const data = await response.json();

      mapJokeResponseFromApi(data);
    } catch (error) {
      console.log(error);
    }
  };

  const onClickLikeJoke = async () => {
    await fetchRandomJoke();

    while (numOdRetries < 5 && likedJokes[joke.id]) {
      numOdRetries += 1;
      await fetchRandomJoke();
    }

    numOdRetries = 0;
    setLikedJokes({ ...likedJokes, [joke.id]: joke });
    saveToLocalStorage();
  };

  const onClickDeslikeJoke = async () => {
    await fetchRandomJoke();

    while (numOdRetries < 5 && deslikedJokes[joke.id]) {
      numOdRetries += 1;
      await fetchRandomJoke();
    }

    numOdRetries = 0;
    // setLikedJokes({ ...likedJokes, [joke.id]: joke });
  };

  const onClickShowLikedJokes = () => {};

  const removeJoke = (selectedJoke) => {
    const filteredJokes = { ...likedJokes };
    delete filteredJokes[selectedJoke.id];

    setLikedJokes(filteredJokes);
    saveToLocalStorage(selectedJoke);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  const saveToLocalStorage = (selected) => {
    // setLikedJokes({ ...likedJokes, [joke.id]: joke });
    // const obj = {...likedJokes, [joke.id]: joke}
    let likesJokesStr = null;

    if (selected) {
      const obj = { ...likedJokes };
      delete obj[selected.id];
      likesJokesStr = JSON.stringify(obj);
    } else {
      likesJokesStr = JSON.stringify({ ...likedJokes, [joke.id]: joke });
    }

    const categoryStr = JSON.stringify(category);
    const languageStr = JSON.stringify(language);
    const typeStr = JSON.stringify(type);

    localStorage.setItem("likedJokes", likesJokesStr);
    localStorage.setItem("category", categoryStr);
    localStorage.setItem("language", languageStr);
    localStorage.setItem("type", typeStr);
  };

  return {
    fetchRandomJoke,
    joke,
    likedJokes,
    setLikedJokes,
    onClickLikeJoke,
    onClickDeslikeJoke,
    removeJoke,
    onClickShowLikedJokes,
    setShowLikedJokes,
    showLikedJokes,
    category,
    type,
    language,
    handleCategoryChange,
    handleLanguageChange,
    handleTypeChange,
  };
}

export default HomeVM;
