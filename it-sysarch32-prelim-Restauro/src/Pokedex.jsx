import React, { useState, useEffect } from 'react';

function Pokedex() {
  const [pokemonDetails, setPokemonDetails] = useState([]);
  const [language, setLanguage] = useState('english');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch('https://us-central1-it-sysarch32.cloudfunctions.net/pokemon')
      .then(response => response.json())
      .then(data => {
        setPokemonDetails(data);
        setIsLoading(false);
      });
  }, []);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setIsLoading(true);
    const url = `pagination?page=${pageNumber}`;
    window.history.pushState(null, '', url);
    fetch(`https://us-central1-it-sysarch32.cloudfunctions.net/pokemon?page=${pageNumber}`)
      .then(response => response.json())
      .then(data => {
        setPokemonDetails(data);
        setIsLoading(false);
      });
  };

  const startIndex = (currentPage - 1) * 10;
  const endIndex = startIndex + 10;

  const totalPages = Math.ceil(pokemonDetails.length / 10);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <div>
      <div className="language-buttons">
        <button onClick={() => handleLanguageChange('english')}>English</button>
        <button onClick={() => handleLanguageChange('japanese')}>Japanese</button>
        <button onClick={() => handleLanguageChange('chinese')}>Chinese</button>
        <button onClick={() => handleLanguageChange('french')}>French</button>
      </div>
      <div className="page-buttons">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={currentPage === pageNumber ? 'active' : ''}
          >
            {pageNumber}
          </button>
        ))}
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
      {isLoading ? (
        <p className="loading">Loading...</p>
      ) : (
        pokemonDetails.slice(startIndex, endIndex).map((pokemon, index) => (
          <div className="cardpokemon" key={index}>
            <img className="pic" alt="Pokemon Picture" src={pokemon.image} />
            <h2 className="id">[{pokemon.id}]</h2>
            <h2 className="name">{pokemon.name[language]}</h2>
          </div>
        ))
      )}
    </div>
  );
}

export default Pokedex;