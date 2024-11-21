import {Component} from 'react'
import Header from '../Header'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import './index.css'

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'IN_PROGRESS',
}
class CourseItemDetails extends Component {
  state = {courseDetailsList: [], apiStatus: apiConstants.initial}
  componentDidMount() {
    this.getCourseDetails()
  }

  getCourseDetails = async () => {
    this.setState({apiStatus: apiConstants.in_progress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const response = await fetch(`https://apis.ccbp.in/te/courses/${id}`)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      const updatedData = {
        id: data.course_details.id,
        name: data.course_details.name,
        imageUrl: data.course_details.image_url,
        description: data.course_details.description,
      }
      this.setState({
        courseDetailsList: updatedData,
        apiStatus: apiConstants.success,
      })
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
    const {courseDetailsList} = this.state
    return (
      <div className="course-details-container">
        <img
          src={courseDetailsList.imageUrl}
          alt={courseDetailsList.name}
          className="course-img"
        />
        <div className="text">
          <h1>{courseDetailsList.name}</h1>
          <p>{courseDetailsList.description}</p>
        </div>
      </div>
    )
  }
  onClickRetry = () => {
    this.getCourseDetails()
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
      <Link className="link" to="/">
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

export default CourseItemDetails
