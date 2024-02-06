class App extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      userData: null,
      reposData: null,
      error: null,
      visibleRepos: 6,
    };
  }

  handleInputChange = (event) => {
    this.setState({ username: event.target.value });
  };
  handleSearch = async () => {
    const { username } = this.state;
  
    try {
      // user data fetch
      const userResponse = await fetch(`https://api.github.com/users/${username}`);
      if (!userResponse.ok) {
        throw new Error('User not found');
      }
      const userData = await userResponse.json();
  
      // user repo fetch
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);
      const reposData = await reposResponse.json();
  
      this.setState({
        userData,
        reposData,
        error: null,
      });
    } catch (error) {
      this.setState({
        userData: null,
        reposData: null,
        error: error.message, 
      });
    }
  };
  

  renderRepositoryLink(repo) {
    return (
      <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
        {repo.name}
      </a>
    );
  }

  handleSeeAllClick = () => {
    this.setState((prevState) => ({
      visibleRepos: prevState.reposData.length,
    }));
  };

  handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      this.handleSearch();
    }
  };
  
  

  render() {
    const { username, userData, reposData, error, visibleRepos } = this.state;

    return (
      // search page elements
      <div>
        <h1>
          <img class="logotardi" src="logo.jpg" alt="GitHub Logo" style={{ height: '30px', marginRight: '10px' }} />
          GitHub User Finder
        </h1>
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter GitHub username"
            value={username}
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
          />
          <button onClick={this.handleSearch}>Search</button>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {userData && (
          <div>
            <div className="user-info">
              <div className="user-header">
                <img src={userData.avatar_url} alt={`${userData.login}'s avatar`} />
                <div className="user-stats">
                  <p className="small-text">Followers</p>
                  <p className="big-text">{userData.followers}</p>
                </div>
                <div className="user-stats">
                  <p className="small-text">Following</p>
                  <p className="big-text">{userData.following}</p>
                </div>
                <div className="user-stats">
                  <p className="small-text">Repos</p>
                  <p className="big-text">{userData.public_repos}</p>
                </div>
              </div>
              <h2>
                <a href={`https://github.com/${userData.login}`} target="_blank" rel="noopener noreferrer">
                  @{userData.login}
                </a>
              </h2>
              <p>{userData.bio}</p>
            </div>
          </div>
        )}
        {reposData && (
          <div>
            <h3>Repositories:</h3>
            <div className="repo-list-container">
              <ul>
                {reposData.slice(0, visibleRepos).map((repo) => (
                  <li key={repo.id}>
                    <strong>
                      {repo.stargazers_count} ⭐ {this.renderRepositoryLink(repo)}
                    </strong>{" "}
                    - {repo.description}
                  </li>
                ))}
              </ul>
            </div>
            {reposData.length > visibleRepos && (
              <button className="see-all-button" onClick={this.handleSeeAllClick}>
                Load More
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
}
