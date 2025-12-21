import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification
} from "firebase/auth";
import { auth } from "./firebase.js";


export const signup = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        await sendEmailVerification(userCredential.user);
        await auth.currentUser.reload();

        if (auth.currentUser.emailVerified) {
            console.log("Email verified");
        }

        return userCredential.user;
    } catch (error) {
        const authError = new Error(error.message);
        authError.code = error.code;
        throw authError;
    }
};

// if (!auth.currentUser.emailVerified) {
//   alert("Please verify your email before continuing");
// }


export const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        return userCredential.user;
    } catch (error) {
        const authError = new Error(error.message);
        authError.code = error.code;
        throw authError;
    }
};


export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        const authError = new Error(error.message);
        authError.code = error.code;
        throw authError;
    }
};
