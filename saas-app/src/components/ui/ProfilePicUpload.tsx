'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

interface ProfilePicUploadProps {
    userId: string;
    currentPic?: string;
    onSuccess: () => void;
}

export default function ProfilePicUpload({ userId, currentPic, onSuccess }: ProfilePicUploadProps) {
    const [showCropper, setShowCropper] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);
    const cropperRef = useRef<Cropper | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result as string);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const initCropper = () => {
        if (imageRef.current) {
            cropperRef.current = new Cropper(imageRef.current, {
                aspectRatio: 1,
                viewMode: 1,
                guides: true,
                background: false,
                autoCropArea: 1,
            } as any);
        }
    };

    const handleSave = async () => {
        if (!cropperRef.current) return;
        setLoading(true);

        (cropperRef.current as any).getCroppedCanvas({ width: 400, height: 400 }).toBlob(async (blob: Blob | null) => {
            if (blob) {
                const filePath = `${userId}/profile_${Date.now()}.jpg`;

                const { error: uploadError } = await supabase.storage
                    .from('profile-pictures')
                    .upload(filePath, blob, { upsert: true });

                if (uploadError) {
                    alert(uploadError.message);
                    setLoading(false);
                    return;
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('profile-pictures')
                    .getPublicUrl(filePath);

                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({ profile_picture_url: publicUrl })
                    .eq('id', userId);

                if (updateError) {
                    alert(updateError.message);
                } else {
                    onSuccess();
                    setShowCropper(false);
                }
            }
            setLoading(false);
        }, 'image/jpeg');
    };

    return (
        <div className="relative group">
            <div className="w-36 h-36 rounded-full overflow-hidden border-2 border-[#136dec] shadow-[0_0_20px_rgba(19,109,236,0.3)] bg-[#111]">
                <img src={currentPic || '/default-avatar.png'} alt="Profile" className="w-full h-full object-cover" />
            </div>

            <label className="absolute bottom-1 right-1 bg-[#136dec] p-2 rounded-full cursor-pointer border-2 border-[#050505] hover:scale-110 transition-transform">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                </svg>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>

            {showCropper && (
                <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 backdrop-blur-xl">
                    <div className="w-full max-w-2xl bg-[#111] rounded-3xl overflow-hidden border border-white/10">
                        <div className="p-4 border-b border-white/10 flex justify-between items-center">
                            <span className="font-bold uppercase tracking-widest text-[#a0a0a0] text-xs">Recadrer le profil</span>
                            <button onClick={() => setShowCropper(false)} className="text-white hover:text-red-500">×</button>
                        </div>
                        <div className="max-h-[60vh] overflow-hidden bg-black flex items-center justify-center">
                            <img ref={imageRef} src={imageSrc!} onLoad={initCropper} style={{ maxWidth: '100%' }} />
                        </div>
                        <div className="p-6 flex gap-4">
                            <button
                                onClick={() => setShowCropper(false)}
                                className="flex-1 py-4 bg-white/5 text-white font-bold rounded-xl"
                            >
                                ANNULER
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="flex-1 py-4 bg-[#136dec] text-white font-bold rounded-xl disabled:opacity-50"
                            >
                                {loading ? 'ENREGISTREMENT...' : 'VALIDER'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
