import { ArrowLeft, X } from "lucide-react"
import { useNavigate } from "react-router-dom"


export function AuthLayout({ children, showBack = false, onClose, bgImage }) {
    const navigate = useNavigate()

    const handleBack = () => {
        navigate(-1)
    }

    const handleClose = () => {
        if (onClose) {
            onClose()
        } else {
            navigate("/")
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat py-10"
            style={{
                backgroundImage: `url('${bgImage}')`,
            }}
        >
            <div className="w-full max-w-4xl relative">
                <div className="flex w-full items-center justify-between absolute p-4">
                    {showBack && (
                        <button
                            onClick={handleBack}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                            aria-label="Go back"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                    )}
                    {!showBack && <div />}

                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
                <div className="bg-white/85 bakdrop-blur-md shadow-lg rounded-2xl px-10 py-20 md:px-20">
                    {/* Content */}
                    {children}
                </div>
            </div>
        </div>
    )
}
