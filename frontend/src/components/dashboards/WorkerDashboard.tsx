"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Briefcase, MapPin, Star, Clock, CheckCircle2, AlertCircle, ChevronRight, User, Volume2, VolumeX } from "lucide-react";
import { api } from "@/lib/api";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";

export default function WorkerDashboard({ user }: { user: any }) {
    const { speak, toggleVoice, isVoiceEnabled, phrases } = useVoiceAssistant();
    const [requests, setRequests] = useState<any[]>([]);
    const [workerStats, setWorkerStats] = useState<any>(null);
    const [aadhaar, setAadhaar] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [showProfileEditor, setShowProfileEditor] = useState(false);
    const [profileForm, setProfileForm] = useState({
        skills: [] as string[],
        experience_years: 0,
        service_charges: 0
    });

    useEffect(() => {
        async function loadData() {
            try {
                const [reqs, profile] = await Promise.all([
                    api.getWorkerRequests(),
                    api.getWorkerProfile()
                ]);
                setRequests(reqs);
                setWorkerStats(profile);
                if (profile) {
                    setProfileForm({
                        skills: profile.skills || [],
                        experience_years: profile.experience_years || 0,
                        service_charges: profile.service_charges || 0
                    });
                }
            } catch (err) { console.error(err); }
        }
        loadData();
    }, []);

    const handleAadhaarVerify = async () => {
        if (aadhaar.length !== 12) return;
        setVerifying(true);
        speak(phrases.VERIFY_AADHAAR_PROMPT); 
        try {
            await api.verifyAadhaar(aadhaar);
            speak(phrases.VERIFY_SUCCESS);
            setTimeout(() => window.location.reload(), 2000); 
        } catch (err) {
            alert("Verification failed: " + err);
        } finally {
            setVerifying(false);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            await api.updateWorkerProfile(profileForm);
            setShowProfileEditor(false);
            const updatedProfile = await api.getWorkerProfile();
            setWorkerStats(updatedProfile);
        } catch (err) {
            alert("Failed to update profile: " + err);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white uppercase italic tracking-wider">Worker Hub</h1>
                    <p className="text-dark-400 mt-2 tracking-tight font-medium">Manage your services, verification, and job requests in one place.</p>
                </div>
                <div className="flex gap-4 items-center">
                    <button 
                        onClick={toggleVoice}
                        className={`p-2 rounded-full border transition-all ${isVoiceEnabled ? "border-primary-500 text-primary-400 bg-primary-500/10" : "border-white/10 text-dark-500"}`}
                        title={isVoiceEnabled ? "Disable Voice Voice Guidance" : "Enable Voice Guidance"}
                    >
                        {isVoiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>
                    <button 
                        onClick={() => {
                            setShowProfileEditor(true);
                            speak(phrases.UPDATE_PROFILE);
                        }}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <User className="w-4 h-4" /> Edit Profile
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Verification & Profile Editor Modal-like section */}
                    {showProfileEditor && (
                        <section className="glass-card p-8 border-primary-500/30 bg-primary-500/5 relative">
                            <button 
                                onClick={() => setShowProfileEditor(false)}
                                className="absolute top-4 right-4 text-dark-400 hover:text-white"
                            >✕</button>
                            <h3 className="text-2xl font-bold text-white mb-6">Complete Your Profile</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm text-dark-300 mb-2 block">Skills (Comma separated)</label>
                                    <input 
                                        type="text" 
                                        value={profileForm.skills.join(", ")}
                                        onChange={(e) => setProfileForm({...profileForm, skills: e.target.value.split(",").map(s => s.trim())})}
                                        className="input-field"
                                        placeholder="e.g. Electrician, Plumbing"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-dark-300 mb-2 block">Years of Experience</label>
                                        <input 
                                            type="number" 
                                            value={profileForm.experience_years}
                                            onChange={(e) => setProfileForm({...profileForm, experience_years: parseInt(e.target.value)})}
                                            className="input-field"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-dark-300 mb-2 block">Service Charges (₹/hr)</label>
                                        <input 
                                            type="number" 
                                            value={profileForm.service_charges}
                                            onChange={(e) => setProfileForm({...profileForm, service_charges: parseFloat(e.target.value)})}
                                            className="input-field"
                                        />
                                    </div>
                                </div>
                                <button onClick={handleUpdateProfile} className="btn-primary w-full py-4">Save Profile Changes</button>
                            </div>
                        </section>
                    )}

                    {/* Aadhaar Verification Section */}
                    {!user.is_verified && !showProfileEditor && (
                        <section className="glass-card p-6 border-l-4 border-accent-amber bg-accent-amber/5">
                            <div className="flex items-start gap-4">
                                <AlertCircle className="w-6 h-6 text-accent-amber flex-shrink-0" />
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-2 underline underline-offset-4 decoration-accent-amber/30">Verification Required</h3>
                                    <p className="text-sm text-dark-300 mb-6 font-medium leading-relaxed">To start accepting job requests, please verify your identity using your 12-digit Aadhaar number.</p>
                                    <div className="flex gap-4">
                                        <input 
                                            type="text" 
                                            placeholder="XXXX XXXX XXXX" 
                                            value={aadhaar}
                                            onChange={(e) => setAadhaar(e.target.value)}
                                            className="bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 flex-1 font-mono tracking-widest"
                                        />
                                        <button 
                                            onClick={handleAadhaarVerify}
                                            disabled={verifying || aadhaar.length !== 12}
                                            className="btn-primary"
                                        >
                                            {verifying ? "Verifying..." : "Verify Now"}
                                        </button>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-white/5">
                                        <p className="text-xs text-dark-500 mb-3">OR VERIFY VIA DIGILOCKER</p>
                                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/10 border border-blue-600/30 text-blue-400 text-xs font-bold hover:bg-blue-600/20 transition-all">
                                            <ShieldCheck className="w-4 h-4" /> Fetch from DigiLocker
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {user.is_verified && (
                        <section className="glass-card p-6 border-l-4 border-accent-emerald bg-accent-emerald/5">
                            <div className="flex items-center gap-4">
                                <CheckCircle2 className="w-8 h-8 text-accent-emerald" />
                                <div>
                                    <h3 className="text-lg font-bold text-white">Identity Verified</h3>
                                    <p className="text-sm text-dark-300 font-medium">You are eligible to receive premium job requests in your locality.</p>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Job Requests */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                             <Briefcase className="w-6 h-6 text-primary-400" /> Incoming Requests
                        </h2>
                        <div className="space-y-4">
                            {requests.length === 0 ? (
                                <div className="glass-card p-12 text-center">
                                    <Clock className="w-12 h-12 text-dark-600 mx-auto mb-4" />
                                    <p className="text-dark-400 font-medium">No new requests at the moment. Stay tuned!</p>
                                </div>
                            ) : (
                                requests.map((req, i) => (
                                    <div key={i} className="glass-card p-6 hover:bg-white/5 transition-colors group">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="px-2 py-0.5 rounded bg-primary-500/10 text-primary-400 text-xs font-bold uppercase tracking-widest">{req.work_type}</span>
                                                    <span className="text-xs text-dark-500 flex items-center gap-1 font-medium"><MapPin className="w-3 h-3" /> {req.location}</span>
                                                </div>
                                                <h4 className="text-white font-bold text-lg mb-1 leading-tight">{req.description}</h4>
                                                <p className="text-xs text-dark-500 tracking-tight font-medium uppercase font-mono">Posted by Customer ID: {req.customer_id.substring(0, 8)}...</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-accent-emerald">₹{req.budget}</div>
                                                    <div className="text-xs text-dark-400 font-medium uppercase opacity-60">Estimated Budget</div>
                                                </div>
                                                <button 
                                                    onClick={() => speak(phrases.ACCEPT_JOB)}
                                                    className="btn-secondary group-hover:bg-accent-emerald group-hover:text-white transition-all"
                                                >
                                                    Accept Job
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                    <section className="glass-card p-6">
                         <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-primary-500/50 flex items-center justify-center text-2xl font-bold text-primary-400 overflow-hidden">
                                {user.name?.[0]}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-wide">{user.name}</h3>
                                <div className="flex items-center gap-1 text-accent-amber mt-1">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="text-sm font-bold">{workerStats?.rating || 0}</span>
                                    <span className="text-xs text-dark-400 font-medium ml-1">({workerStats?.total_reviews || 0} Reviews)</span>
                                </div>
                            </div>
                         </div>
                         <div className="space-y-4 pt-4 border-t border-white/5">
                            <div className="flex justify-between text-sm">
                                <span className="text-dark-400 font-medium tracking-tight">Status</span>
                                <span className={workerStats?.availability ? "text-accent-emerald font-bold uppercase tracking-wider text-xs" : "text-red-400 font-bold uppercase tracking-wider text-xs"}>
                                    {workerStats?.availability ? "Available" : "Busy"}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-dark-400 font-medium tracking-tight">Experience</span>
                                <span className="text-white font-bold opacity-80 uppercase text-xs tracking-wider">{workerStats?.experience_years || 0} Years</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-dark-400 font-medium tracking-tight">Rate</span>
                                <span className="text-white font-bold opacity-80 uppercase text-xs tracking-wider">₹{workerStats?.service_charges || 0}/hr</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-dark-400 font-medium tracking-tight">Total Earnings</span>
                                <span className="text-accent-emerald font-bold uppercase text-xs tracking-wider">₹{workerStats?.total_earnings || 0}</span>
                            </div>
                         </div>
                    </section>
                    
                    {/* Media Display Section (Photos/Videos) */}
                    <section className="glass-card p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Work Portfolio</h3>
                        <div className="grid grid-cols-2 gap-2">
                             {[1,2,3,4].map(i => (
                                <div key={i} className="aspect-square rounded-lg bg-slate-800 animate-pulse border border-white/5 flex items-center justify-center">
                                    <ShieldCheck className="w-6 h-6 text-white/10" />
                                </div>
                             ))}
                        </div>
                        <button className="w-full mt-4 py-2 border border-white/10 rounded-lg text-xs font-bold text-dark-400 hover:text-white transition-all">Upload Media</button>
                    </section>
                </div>
            </div>
        </div>
    );
}
