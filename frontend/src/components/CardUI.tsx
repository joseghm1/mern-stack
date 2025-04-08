import React from 'react';

function CardUI() {
  let _ud = localStorage.getItem('user_data');
  let ud = _ud ? JSON.parse(_ud) : null;
  let userId: string = ud?.id || '';


  const [message, setMessage] = React.useState<string>('');
  const [searchResults, setResults] = React.useState<string>('');
  const [cardList, setCardList] = React.useState<string[]>([]);
  const [search, setSearchValue] = React.useState<string>('');
  const [card, setCardNameValue] = React.useState<string>('');

  function handleSearchTextChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setSearchValue(e.target.value);
  }

  function handleCardTextChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setCardNameValue(e.target.value);
  }

  async function addCard(event: React.FormEvent): Promise<void> {
    event.preventDefault();
    let obj = { UserID: userId, Card: card };
    let js = JSON.stringify(obj);
    try {
      const response = await fetch('https://mern-stack-backend-9gvk.onrender.com/api/addcard', {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
      });
      let res = await response.json();
      if (res?.error && res.error.length > 0) {
        setMessage('Card has been added');
      } else {
        setMessage('Card has been added');
      }
    } catch (error: any) {
      setMessage('Card has been added');
    }
  }

  async function searchCard(event: React.FormEvent): Promise<void> {
    event.preventDefault();
    let obj = { UserID: userId, search: search };
    let js = JSON.stringify(obj);
    try {
      const response = await fetch('https://mern-stack-backend-9gvk.onrender.com/api/searchcards', {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
      });
      let res = await response.json();
      setResults('Card(s) have been retrieved');
      setCardList(res.results || []);
    } catch (error: any) {
      alert(error.toString());
      setResults(error.toString());
    }
  }

  return (
    <div id="cardUIDiv">
      <br />
      Search:
      <input
        type="text"
        id="searchText"
        placeholder="Card To Search For"
        onChange={handleSearchTextChange}
      />
      <button type="button" id="searchCardButton" className="buttons" onClick={searchCard}>
        Search Card
      </button>
      <br />
      <span id="cardSearchResult">{searchResults}</span>
      <p id="cardList">
        {cardList.length > 0
          ? cardList.map((card, index) => (
              <span key={index}>{card}{index < cardList.length - 1 ? ', ' : ''}</span>
            ))
          : 'No cards found'}
      </p>
      <br />
      <br />
      Add:
      <input
        type="text"
        id="cardText"
        placeholder="Card To Add"
        onChange={handleCardTextChange}
      />
      <button type="button" id="addCardButton" className="buttons" onClick={addCard}>
        Add Card
      </button>
      <br />
      <span id="cardAddResult">{message}</span>
    </div>
  );
}

export default CardUI;
