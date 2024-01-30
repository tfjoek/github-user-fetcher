class App extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      userData: null,
      reposData: null,
      error: null,
      visibleRepos: 2,
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
        error: "User not found",
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

  render() {
    const { username, userData, reposData, error } = this.state;

    return (
      <div>
        <h1>GitHub User Finder</h1>
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter GitHub username"
            value={username}
            onChange={this.handleInputChange}
          />
          <button onClick={this.handleSearch}>Search</button>
        </div>
        {error && <p>{error}</p>}
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
            <ul>
              {reposData.map((repo) => (
                <li key={repo.id}>
                  <strong>{this.renderRepositoryLink(repo)}</strong> - {repo.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}
