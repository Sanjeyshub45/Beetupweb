"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, User, Mail, Phone, Building2, MapPin, Calendar, Loader2 } from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { useUserProfile, useUpdateUserProfile, useUserEventsCount } from "@/hooks/useUserProfile";
import { logoutUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { uploadImage } from "@/lib/storage";

export default function SettingsPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuthStore();
    const { data: profile, isLoading: profileLoading } = useUserProfile(user?.uid);
    const { data: eventsCount } = useUserEventsCount(user?.uid);
    const updateProfile = useUpdateUserProfile();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        organizationName: "",
        city: ""
    });
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || "",
                email: profile.email || user?.email || "",
                phone: profile.phone || user?.phoneNumber || "",
                organizationName: profile.organizationName || "",
                city: profile.city || ""
            });
        } else if (user) {
            // Default to auth data if no profile doc yet
            setFormData(prev => ({
                ...prev,
                email: user.email || "",
                phone: user.phoneNumber || ""
            }));
        }
    }, [profile, user]);

    if (authLoading || (user && profileLoading)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) return null;

    const handleLogout = async () => {
        try {
            await logoutUser();
            router.push("/");
        } catch (error) {
            toast.error("Error logging out.");
        }
    };

    const handleSave = async () => {
        try {
            await updateProfile.mutateAsync({ uid: user.uid, data: formData });
            setIsEditing(false);
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Failed to update profile.");
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingImage(true);
            const url = await uploadImage(file, `profiles/${user.uid}/${file.name}`);
            if (url) {
                await updateProfile.mutateAsync({ uid: user.uid, data: { profileLink: url } });
                toast.success("Profile picture updated!");
            }
        } catch (error) {
            toast.error("Failed to upload image.");
        } finally {
            setUploadingImage(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-40 pb-16 px-6">
            <div className="container mx-auto max-w-4xl">

                <div className="mb-12 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Account Settings</h1>
                        <p className="text-slate-500">Manage your personal information and preferences.</p>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Sign Out</span>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Profile Card Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="md:col-span-1"
                    >
                        <div className="bg-white glass rounded-3xl p-6 border border-slate-200 flex flex-col items-center text-center">
                            <div className="relative group mb-4">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 relative bg-slate-100">
                                    {uploadingImage ? (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
                                            <Loader2 className="w-6 h-6 animate-spin text-slate-900" />
                                        </div>
                                    ) : null}
                                    <img
                                        src={profile?.profileLink || `https://ui-avatars.com/api/?name=${profile?.name || '-'}&background=random`}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                    <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-sm font-medium">
                                        Upload Photo
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                                    </label>
                                </div>
                            </div>

                            <h2 className="text-xl font-bold mb-1">{profile?.name || "Anonymous User"}</h2>
                            <p className="text-slate-500 text-sm mb-6">{profile?.organizationName || "No Organization"}</p>

                            <div className="w-full h-px bg-white/10 mb-6"></div>

                            <div className="w-full flex justify-between items-center text-sm">
                                <span className="text-slate-500 flex items-center gap-2"><Calendar className="w-4 h-4" /> Events Listed</span>
                                <span className="font-bold text-slate-900 bg-white/10 px-3 py-1 rounded-full">{eventsCount || 0}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Details Form Area */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="md:col-span-2"
                    >
                        <div className="bg-white glass rounded-3xl p-6 md:p-8 border border-slate-200">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-bold">Personal Information</h3>
                                <Button
                                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                    disabled={updateProfile.isPending}
                                    className={isEditing ? "bg-green-500 hover:bg-green-600 text-white" : "bg-white/10 hover:bg-white/20 text-slate-900"}
                                >
                                    {updateProfile.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : isEditing ? "Save Changes" : "Edit Profile"}
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-slate-500 flex items-center gap-2">
                                        <User className="w-4 h-4" /> Full Name
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="bg-slate-50 border-slate-200"
                                        />
                                    ) : (
                                        <div className="h-10 px-3 py-2 text-slate-900 font-medium">{formData.name || "-"}</div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-500 flex items-center gap-2">
                                        <Mail className="w-4 h-4" /> Email Address
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="bg-slate-50 border-slate-200"
                                        />
                                    ) : (
                                        <div className="h-10 px-3 py-2 text-slate-900 font-medium">{formData.email || "-"}</div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-500 flex items-center gap-2">
                                        <Phone className="w-4 h-4" /> Phone Number
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="bg-slate-50 border-slate-200"
                                            disabled={!!user.phoneNumber} // Prevent changing auth verified number
                                        />
                                    ) : (
                                        <div className="h-10 px-3 py-2 text-slate-900 font-medium">{formData.phone || "-"}</div>
                                    )}
                                    {isEditing && user.phoneNumber && <p className="text-xs text-slate-500/50">Verified via login</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-500 flex items-center gap-2">
                                        <Building2 className="w-4 h-4" /> Organization Name
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.organizationName}
                                            onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                                            className="bg-slate-50 border-slate-200"
                                        />
                                    ) : (
                                        <div className="h-10 px-3 py-2 text-slate-900 font-medium">{formData.organizationName || "-"}</div>
                                    )}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-slate-500 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" /> City/Location
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="bg-slate-50 border-slate-200"
                                        />
                                    ) : (
                                        <div className="h-10 px-3 py-2 text-slate-900 font-medium">{formData.city || "-"}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}
