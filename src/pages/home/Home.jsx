import { useEffect } from "react";
import HomeVM from "./HomeVM";
import styled from "styled-components";
import { JOKE_CATEGORIES, JOKE_TYPE, LANGUAGES } from "../../utils/constants";

const StyledContainer = styled.div`
  margin-top: 20px;
`;

const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const StyledRCol = styled.div`
  display: flex;
  flex-direction: column;
`;

function Home() {
  const {
    joke,
    fetchRandomJoke,
    likedJokes,
    onClickLikeJoke,
    onClickDeslikeJoke,
    removeJoke,
    showLikedJokes,
    setShowLikedJokes,
    category,
    type,
    language,
    handleCategoryChange,
    handleLanguageChange,
    handleTypeChange,
  } = HomeVM();

  useEffect(() => {
    fetchRandomJoke();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StyledContainer>
      <StyledRow>{joke?.description}</StyledRow>
      <StyledRow>
        <button onClick={onClickLikeJoke} name="like">
          Like
        </button>{" "}
        <button onClick={onClickDeslikeJoke} name="deslike">
          Dislike
        </button>{" "}
        <StyledRCol>
          <label htmlFor="categories">Categories</label>
          <select
            name="categories"
            id="categories"
            value={category}
            onChange={handleCategoryChange}
          >
            <option value={""}>--select---</option>
            {JOKE_CATEGORIES.map((category) => (
              <option value={category} key={category}>
                {category}
              </option>
            ))}
          </select>
        </StyledRCol>
        <StyledRCol>
          <label htmlFor="language">Languages</label>
          <select
            name="language"
            id="language"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value={""}>--select---</option>
            {LANGUAGES.map((language) => (
              <option value={language.id} key={language.id}>
                {language.name}
              </option>
            ))}
          </select>
        </StyledRCol>
        <StyledRCol>
          <label htmlFor="type">Type</label>
          <select
            name="type"
            id="type"
            value={type}
            onChange={handleTypeChange}
          >
            <option value={""}>--select---</option>
            {JOKE_TYPE.map((type) => (
              <option value={type} key={type}>
                {type}
              </option>
            ))}
          </select>
        </StyledRCol>
      </StyledRow>
      <StyledRow>
        <button
          onClick={() => setShowLikedJokes(!showLikedJokes)}
          name="show-jokes"
        >
          {showLikedJokes ? "Hide liked jokes" : " Show liked jokes"}
        </button>{" "}
      </StyledRow>
      <StyledRCol>
        {showLikedJokes &&
          Object.values(likedJokes).map((joke) => (
            <StyledRow key={joke.id}>
              <div>{joke.description}</div>
              <div>
                <button onClick={() => removeJoke(joke)} name="remove-joke">
                  Remove
                </button>{" "}
              </div>
            </StyledRow>
          ))}
      </StyledRCol>
    </StyledContainer>
  );
}

export default Home;
