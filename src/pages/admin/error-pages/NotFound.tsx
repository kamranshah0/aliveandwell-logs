 
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();
    const handleGoBack = () => navigate(-1);
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-primary">404</h1>
                <p className="text-xl text-gray-600 mt-4">Page Not Found</p>
                <p className="text-gray-500 mt-2">The page you are looking for does not exist.</p>
                <Button
                    onClick={() => handleGoBack()}
                    className='mt-6'
                >
                    <ArrowLeft className='mr-2 size-4' />
                     
                    Go to Back
                </Button>
                <Button
                    onClick={() => navigate('/')}
                    className='mt-6'
                >
                    <Home className='mr-2 size-4' />
                    Go to Home
                </Button>
            </div>
        </div>
    )
}

export default NotFound