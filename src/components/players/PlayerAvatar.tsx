import { User } from 'lucide-react';
import { useState } from 'react';

interface PlayerAvatarProps {
    url: string | null;
    alt: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
};

const iconSizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
};

export function PlayerAvatar({ url, alt, size = 'md', className = '' }: PlayerAvatarProps) {
    const [imageError, setImageError] = useState(false);

    if (!url || imageError) {
        return (
            <div
                className={`${sizeClasses[size]} ${className} rounded-full bg-[#a3cf08] flex items-center justify-center shadow-md`}
            >
                <User className={`${iconSizeClasses[size]} text-white`} />
            </div>
        );
    }

    return (
        <img
            src={url}
            alt={alt}
            className={`${sizeClasses[size]} ${className} rounded-full object-cover shadow-md border-2 border-white`}
            onError={() => setImageError(true)}
        />
    );
}
