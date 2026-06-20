import { useState, useEffect } from 'react'
import './index.css'

const JOBS_PER_PAGE = 6
const API_BASE_URL = 'https://hacker-news.firebaseio.com/v0'

function App() {
  const [jobIds, setJobIds] = useState([])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingInitial, setLoadingInitial] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    fetchJobIds()
  }, [])

  const fetchJobIds = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobstories.json`)
      const ids = await response.json()
      setJobIds(ids)
      fetchJobDetails(ids, 0)
    } catch (error) {
      console.error('Error fetching job IDs:', error)
    } finally {
      setLoadingInitial(false)
    }
  }

  const fetchJobDetails = async (ids, page) => {
    setLoading(true)
    const start = page * JOBS_PER_PAGE
    const end = start + JOBS_PER_PAGE
    const batchIds = ids.slice(start, end)

    try {
      const jobPromises = batchIds.map(id =>
        fetch(`${API_BASE_URL}/item/${id}.json`).then(res => res.json())
      )
      const newJobs = await Promise.all(jobPromises)
      setJobs(prevJobs => [...prevJobs, ...newJobs])
      setCurrentPage(page)
    } catch (error) {
      console.error('Error fetching job details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLoadMore = () => {
    if (!loading && (currentPage + 1) * JOBS_PER_PAGE < jobIds.length) {
      fetchJobDetails(jobIds, currentPage + 1)
    }
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
  }

  if (loadingInitial) {
    return <div className="loading">Loading Job Board...</div>
  }

  return (
    <div className="container">
      <header>
        <h1>Hacker News Jobs Board</h1>
      </header>

      <main>
        <div className="job-list">
          {jobs.map((job) => (
            <div key={job.id} className="job-card">
              {job.url ? (
                <a 
                  href={job.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="job-title clickable"
                >
                  {job.title}
                </a>
              ) : (
                <span className="job-title">{job.title}</span>
              )}
              <div className="job-meta">
                <span>By {job.by}</span>
                <span>{formatDate(job.time)}</span>
              </div>
            </div>
          ))}
        </div>

        {jobs.length < jobIds.length && (
          <button 
            className="load-more-btn" 
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load more jobs'}
          </button>
        )}
      </main>
    </div>
  )
}

export default App
