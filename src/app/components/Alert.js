export default function Alert({ type = 'info', message }) {
    const baseStyle = 'p-4 rounded-md text-sm font-medium flex items-center gap-2'
    const variants = {
      success: 'bg-green-100 text-green-800 border border-green-300',
      error: 'bg-red-100 text-red-800 border border-red-300',
      warning: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      info: 'bg-blue-100 text-blue-800 border border-blue-300',
    }
  
    return (
      <div className={`${baseStyle} ${variants[type]}`}>
        {message}
      </div>
    )
  }
  