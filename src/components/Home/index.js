import {Component} from 'react'
import {Link} from 'react-router-dom'
import Header from '../Header'
import Loader from 'react-loader-spinner'
import './index.css'

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'IN_PROGRESS',
}
class Home extends Component {
  state = {coursesList: [], apiStatus: apiConstants.initial}
  componentDidMount() {
    this.getCoursesList()
  }

  getCoursesList = async () => {
    this.setState({apiStatus: apiConstants.in_progress})
    const apiUrl = 'https://apis.ccbp.in/te/courses'
    const response = await fetch(apiUrl)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      const updatedData = data.courses.map(each => ({
        id: each.id,
        name: each.name,
        logoUrl: each.logo_url,
      }))
      this.setState({coursesList: updatedData, apiStatus: apiConstants.success})
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  renderLoaderView = () => {
    return (
      <div data-testid="loader" className="loader-container">
        <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
      </div>
    )
  }

  renderSuccessView = () => {
    const {coursesList} = this.state
    return (
      <div className="app-container">
        <h1>Courses</h1>
        <ul>
          {coursesList.map(each => (
            <Link className="link" to={`/courses/${each.id}`} key={each.id}>
              <li>
                <img src={each.logoUrl} alt={each.name} />
                <p>{each.name}</p>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    )
  }
  onClickRetry = () => {
    this.getCoursesList()
  }
  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/tech-era/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <Link to="/">
        <button onClick={this.onClickRetry}>Retry</button>
      </Link>
    </div>
  )

  renderAllViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return this.renderSuccessView()
      case apiConstants.failure:
        return this.renderFailureView()
      case apiConstants.in_progress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderAllViews()}
      </>
    )
  }
}

export default Home
