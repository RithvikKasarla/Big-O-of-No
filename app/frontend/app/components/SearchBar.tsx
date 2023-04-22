import React, { ChangeEvent, FormEvent } from "react";

interface SearchBarProps {
  onSearch: (term: string) => void;
}

interface SearchBarState {
  term: string;
}

class SearchBar extends React.Component<SearchBarProps, SearchBarState> {
  constructor(props: SearchBarProps) {
    super(props);
    this.state = { term: "" };
    this.onInputChange = this.onInputChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onInputChange(event: ChangeEvent<HTMLInputElement>) {
    const term = event.target.value;
    this.setState({ term });
    console.log(term);
    this.props.onSearch(term); // Call onSearch prop with the search term
  }

  onFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Pass the search term to the onSearch prop
    this.props.onSearch(this.state.term);
  }

  render() {
    return (
      <div className="mx-auto w-full max-w-screen-xl">
        <form className="flex items-center" onSubmit={this.onFormSubmit}>
          <input
            type="text"
            placeholder="Search..."
            value={this.state.term}
            onChange={this.onInputChange}
            className="py-2 px-4 border border-gray-400 rounded-l-md w-full"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md"
          >
            Search
          </button>
        </form>
      </div>
    );
  }
}

export default SearchBar;
