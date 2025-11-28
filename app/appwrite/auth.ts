import { OAuthProvider, Query } from "appwrite";
import { account, appwriteConfig, database } from "./client";
import { redirect } from "react-router";

export const loginWithGoogle = async () => {

    try{
        account.createOAuth2Session(OAuthProvider.Google)
    } catch (e){
        console.log('loginWithGoogle', e);
    }

}

export const getUser = async () => {

    try{
      const user = await account.get();

      if(!user) return redirect('/sign-in');

      const { documents } = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [
            Query.equal('accountId', user.$id),
            Query.select(['name', 'email', 'imageUrl', 'joinedAt', 'accountId'])
        ]
      )
      
      if(documents.length === 0) {
        // User exists in Appwrite but not in our database, redirect to complete profile
        return redirect('/sign-in');
      }

      return documents[0]; // Return the user document

    } catch (e){
        console.log('getUser error:', e);
        return redirect('/sign-in');
    }

}

export const getGooglePicture = async () => {

    try{
       
        // First, try to get the profile picture from Appwrite identities
        const identities = await account.listIdentities();
        
        // Find the Google identity
        const googleIdentity = identities.identities.find(
            (identity: any) => identity.provider === 'google'
        );
        
        if (googleIdentity && googleIdentity.providerAccessToken) {
            // If we have a Google identity with access token, use Google People API
            const response = await fetch(
                'https://people.googleapis.com/v1/people/me?personFields=photos',
                {
                    headers: {
                        'Authorization': `Bearer ${googleIdentity.providerAccessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (response.ok) {
                const data = await response.json();
                if (data.photos && data.photos.length > 0) {
                    // Return the first photo URL (usually the profile picture)
                    return data.photos[0].url;
                }
            }
        }
        
        // Fallback: try to get from current user data if available
        const user = await account.get();
        if (user && user.prefs && user.prefs.avatar) {
            return user.prefs.avatar;
        }
        
        // If no profile picture found, return null
        return null;

    } catch (e){
        console.log('getGooglePicture error:', e);
        return null;
    }

}

export const logoutUser = async () => {

    try{
        await account.deleteSession('current');
        return redirect('/sign-in');
    } catch (e){
        console.log('logoutUser error:', e);
        throw e;
    }

}



export const storeUserData = async () => {

    try{
        const user = await account.get();
        
        if (!user) {
            throw new Error('No authenticated user found');
        }

        // Check if user already exists in database
        const existingUser = await getExistingUser();
        if (existingUser) {
            return existingUser; // User already exists, return existing data
        }

        // Get profile picture from Google
        const imageUrl = await getGooglePicture();

        // Create new user document in database
        const userData = {
            accountId: user.$id,
            name: user.name || user.email?.split('@')[0] || 'User',
            email: user.email,
            imageUrl: imageUrl || null,
            joinedAt: new Date().toISOString()
        };

        const newUser = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.$id, // Use user ID as document ID
            userData
        );

        return newUser;

    } catch (e){
        console.log('storeUserData error:', e);
        throw e;
    }

}
export const getExistingUser = async () => {

    try{
        const user = await account.get();
        
        if (!user) {
            return null; // No authenticated user
        }

        const { documents } = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [
                Query.equal('accountId', user.$id),
                Query.select(['name', 'email', 'imageUrl', 'joinedAt', 'accountId'])
            ]
        );

        if (documents.length > 0) {
            return documents[0]; // Return existing user document
        }

        return null; // User not found in database

    } catch (e){
        console.log('getExistingUser error:', e);
        return null;
    }

}