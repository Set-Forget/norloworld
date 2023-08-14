import PropTypes from 'prop-types'

export default function ProgressBar({ progress }) {
  return(
    <div className="relative mb-5 mt-5 pt-1">
      <div className="mb-4 flex h-2 overflow-hidden rounded bg-gray-100 text-xs">
        <div style={{ width: `${progress}%` }} className="bg-green-500"></div>
      </div>
      <div className="mb-2 flex items-center justify-between text-xs">
        <div className="text-gray-600">Progress</div>
        <div className="text-gray-600">100%</div>
      </div>
    </div>
  )
}

ProgressBar.propTypes = {
  progress: PropTypes.number
}