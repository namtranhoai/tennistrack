import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AvatarUploader } from './AvatarUploader';

interface PlayerFormProps {
    onSubmit: (data: any) => void;
    onCancel: () => void;
    isSubmitting: boolean;
    initialData?: any;
}

export function PlayerForm({ onSubmit, onCancel, isSubmitting, initialData }: PlayerFormProps) {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(initialData?.avatar_url || null);

    const { register, handleSubmit } = useForm({
        defaultValues: initialData || {
            full_name: '',
            gender: '',
            birth_date: '',
            dominant_hand: '',
            backhand_type: '',
            level: '',
            notes: ''
        }
    });

    const handleFormSubmit = (data: any) => {
        onSubmit({ ...data, avatar_url: avatarUrl });
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <AvatarUploader
                currentAvatarUrl={avatarUrl}
                playerId={initialData?.player_id}
                onAvatarChange={setAvatarUrl}
            />

            <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input {...register('full_name', { required: true })} placeholder="John Doe" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Gender</label>
                    <select {...register('gender')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="">Select...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Birth Date</label>
                    <Input type="date" {...register('birth_date')} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Dominant Hand</label>
                    <select {...register('dominant_hand')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="">Select...</option>
                        <option value="right">Right</option>
                        <option value="left">Left</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Backhand</label>
                    <select {...register('backhand_type')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="">Select...</option>
                        <option value="one-hand">One-Handed</option>
                        <option value="two-hand">Two-Handed</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Level</label>
                <Input {...register('level')} placeholder="e.g. 4.0, Pro, Junior" />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <textarea
                    {...register('notes')}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Additional notes..."
                />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Player'}
                </Button>
            </div>
        </form>
    );
}
