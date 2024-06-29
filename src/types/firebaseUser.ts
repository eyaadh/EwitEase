export interface ProviderData {
    providerId: string;
    uid: string;
    displayName: string | null;
    email: string | null;
    phoneNumber: string | null;
    photoURL: string | null;
}

export interface StsTokenManager {
    refreshToken: string;
    accessToken: string;
    expirationTime: number;
}

export interface FirebaseUser {
    uid: string;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    phoneNumber: string;
    providerData?: ProviderData[];
    stsTokenManager?: StsTokenManager;
    createdAt?: string;
    lastLoginAt?: string;
    apiKey?: string;
    appName?: string;
}

//stsTokenManager, createdAt, lastLoginAt, apiKey, appName