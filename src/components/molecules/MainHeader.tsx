import React from 'react'

interface MainHeaderProps {
    title?: string
    description?: string
    actionContent?: React.ReactNode
    className?: string
}

const MainHeader: React.FC<MainHeaderProps> = ({ 
    title, 
    description,
    actionContent,
    className
}) => {
    return (
        <div className={`flex justify-between ${className || ''} max-sm:flex-col sm:items-center sm:gap-4`}>
            <div>
                <h1 className='text-text-high-em text-2xl font-bold'>{title}</h1>
                <p className=' text-gray-500 text-base'>{description}</p>
            </div>  

            {actionContent}
             
        </div>
    )
}

export default MainHeader