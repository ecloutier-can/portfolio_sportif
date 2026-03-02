'use client';

import React, { useState, useRef } from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { Camera, Check, X, Upload } from 'lucide-react';

interface ProfilePicUploadProps {
    userId: string;
    currentUrl: string;
    onSuccess: () => void;
}

const ProfilePicUpload: React.FC<ProfilePicUploadProps> = ({ userId, currentUrl, onSuccess }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [isCropping, setIsCropping] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);
    const cropperRef = useRef<any>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setIsCropping(true);

            // Initialize Cropper after a short delay to ensure image is in DOM
            setTimeout(() => {
                if (imageRef.current) {
                    if (cropperRef.current) cropperRef.current.destroy();
                    cropperRef.current = new Cropper(imageRef.current, {
                        aspectRatio: 1,
                        viewMode: 1,
                        background: false,
                        responsive: true,
                        autoCropArea: 1,
                    } as any);
                }
            }, 100);
        }
    };

    const handleCancel = () => {
        setIsCropping(false);
        setPreviewUrl(null);
        setSelectedFile(null);
        if (cropperRef.current) cropperRef.current.destroy();
    };

    const handleUpload = async () => {
        if (!cropperRef.current) return;

        setUploading(true);
        const canvas = cropperRef.current.getCroppedCanvas({
            width: 400,
            height: 400,
        });

        canvas.toBlob(async (blob: Blob | null) => {
            if (!blob) return;

            try {
                // 1. Upload to Firebase Storage
                const fileRef = ref(storage, `profiles/${userId}/avatar.jpg`);
                await uploadBytes(fileRef, blob);

                // 2. Get Download URL
                const downloadUrl = await getDownloadURL(fileRef);

                // 3. Update Firestore Profile
                const profileRef = doc(db, 'profiles', userId);
                await updateDoc(profileRef, {
                    profile_picture_url: downloadUrl,
                    updated_at: new Date().toISOString()
                });

                setIsCropping(false);
                setPreviewUrl(null);
                setSelectedFile(null);
                onSuccess();
            } catch (error) {
                console.error("Error uploading profile picture:", error);
                alert("Erreur lors de l'upload.");
            } finally {
                setUploading(false);
            }
        }, 'image/jpeg');
    };

    return (
        <div className="relative w-full h-full group">
            {/* Current Avatar or Placeholder */}
            <img
                src={currentUrl || '/default-avatar.png'}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
            />

            {/* Upload Trigger (Overlay) */}
            <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full group-hover:backdrop-blur-sm">
                <Camera className="text-white mb-1" size={24} />
                <span className="text-[8px] font-black uppercase tracking-widest text-white">Changer</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>

            {/* Cropping Modal Overlay */}
            {isCropping && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 sm:p-12">
                    <div className="w-full max-w-xl space-y-8 animate-in fade-in zoom-in duration-300">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black tracking-tighter uppercase">Recadrer la photo</h2>
                            <p className="text-[#a0a0a0] text-xs">Ajustez votre photo pour un affichage circulaire optimal.</p>
                        </div>

                        <div className="relative aspect-square bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                            <img ref={imageRef} src={previewUrl!} alt="Preview" className="max-w-full block" />
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleCancel}
                                className="flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-xs border border-white/10 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                            >
                                <X size={16} /> ANNULER
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="flex-[2] bg-[#136dec] text-white flex items-center justify-center gap-3 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_10px_30px_rgba(19,109,236,0.3)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                            >
                                {uploading ? 'UPLOAD...' : <><Upload size={18} /> CONFIRMER & ENREGISTRER</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePicUpload;
