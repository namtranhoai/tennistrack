import { useState, useRef, ChangeEvent } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { PlayerAvatar } from './PlayerAvatar';

interface AvatarUploaderProps {
    currentAvatarUrl: string | null;
    playerId?: number;
    onAvatarChange: (url: string | null) => void;
}

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

export function AvatarUploader({ currentAvatarUrl, playerId, onAvatarChange }: AvatarUploaderProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): string | null => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            return 'Only JPEG and PNG images are allowed';
        }
        if (file.size > MAX_FILE_SIZE) {
            return 'File size must be less than 3MB';
        }
        return null;
    };

    const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);

        // Validate file
        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to Supabase Storage
        if (playerId) {
            await uploadToStorage(file, playerId);
        }
    };

    const uploadToStorage = async (file: File, id: number) => {
        setUploading(true);
        setError(null);

        try {
            const timestamp = Date.now();
            const fileExt = file.name.split('.').pop();
            const fileName = `players/${id}-${timestamp}.${fileExt}`;

            const { data, error: uploadError } = await supabase.storage
                .from('player-avatars')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('player-avatars')
                .getPublicUrl(data.path);

            onAvatarChange(publicUrl);
        } catch (err: any) {
            setError(err.message || 'Failed to upload image');
            setPreviewUrl(currentAvatarUrl);
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreviewUrl(null);
        onAvatarChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            <label className="text-sm font-medium">Avatar</label>

            <div className="flex items-center space-x-4">
                <PlayerAvatar url={previewUrl} alt="Player avatar" size="lg" />

                <div className="flex-1 space-y-2">
                    <div className="flex space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploading ? 'Uploading...' : 'Upload Image'}
                        </Button>

                        {previewUrl && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleRemove}
                                disabled={uploading}
                            >
                                <X className="w-4 h-4 mr-2" />
                                Remove
                            </Button>
                        )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                        JPEG or PNG, max 3MB
                    </p>

                    {error && (
                        <p className="text-xs text-red-600">{error}</p>
                    )}
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleFileSelect}
                className="hidden"
            />
        </div>
    );
}
