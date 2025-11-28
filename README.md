# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Google Profile Picture Integration

This project includes functionality to fetch user profile pictures from Google People API through Appwrite OAuth integration.

### Implementation Details

The `getGooglePicture()` function in `app/appwrite/auth.ts` provides the following functionality:

1. **Primary Method**: Uses Appwrite's `listIdentities()` to find the Google OAuth identity
2. **Google People API**: If a Google identity with access token is found, calls the Google People API to fetch the profile picture
3. **Fallback**: Attempts to retrieve profile picture from user preferences if available
4. **Error Handling**: Returns `null` if no profile picture is found or if an error occurs

### Usage Example

```typescript
import { getGooglePicture } from "~/appwrite/auth";

const Dashboard = () => {
  const [profilePicture, setProfilePicture] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const pictureUrl = await getGooglePicture();
        setProfilePicture(pictureUrl);
      } catch (error) {
        console.error('Failed to fetch profile picture:', error);
      }
    };

    fetchProfilePicture();
  }, []);

  return (
    <div>
      {profilePicture && (
        <img src={profilePicture} alt="Profile Picture" className="w-16 h-16 rounded-full" />
      )}
    </div>
  );
};
```

### Requirements

- User must be authenticated via Google OAuth through Appwrite
- Google People API access is automatically handled through the OAuth token
- No additional API keys or configuration required beyond Appwrite setup

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
