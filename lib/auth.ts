import { auth } from "./firebase";
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
    signInWithEmailAndPassword,
    ConfirmationResult,
    signOut
} from "firebase/auth";

export const ADMIN_EMAIL = "sanjudote45@gmail.com";

let windowRecaptchaVerifier: RecaptchaVerifier | null = null;
let currentConfirmationResult: ConfirmationResult | null = null;

export const setupRecaptcha = (containerId: string) => {
    if (!windowRecaptchaVerifier && typeof window !== 'undefined') {
        windowRecaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
            size: 'invisible',
            callback: () => {
                // reCAPTCHA solved
            }
        });
    }
    return windowRecaptchaVerifier;
};

export const sendOTP = async (phoneNumber: string, appVerifier: RecaptchaVerifier) => {
    try {
        currentConfirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        return true;
    } catch (error) {
        console.error("Error sending OTP:", error);
        if (windowRecaptchaVerifier) {
            windowRecaptchaVerifier.render().then(widgetId => {
                (window as any).grecaptcha.reset(widgetId);
            });
        }
        throw error;
    }
};

export const verifyOTP = async (code: string) => {
    if (!currentConfirmationResult) throw new Error("Session expired. Please try again.");
    try {
        const result = await currentConfirmationResult.confirm(code);
        return result.user;
    } catch (error) {
        console.error("Error verifying OTP:", error);
        throw error;
    }
};

export const loginAdmin = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Error logging in admin:", error);
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('isAdmin');
        }
    } catch (error) {
        console.error("Error signing out:", error);
        throw error;
    }
};
