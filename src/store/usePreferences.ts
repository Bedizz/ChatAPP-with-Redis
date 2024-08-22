import {create} from 'zustand';

// without describing the type of the preferences, it wont show us the components that we want to use them in the components that we want to use them in
type Preferences = {
    soundEnabled: boolean;
    setSoundEnabled: (soundEnabled: boolean) => void;
};

// const [state,setState] = useState(true) // local state

// this is a global state
export const usePreferences = create<Preferences>((set) => ({
    soundEnabled: true,
    setSoundEnabled: (soundEnabled: boolean) => set({soundEnabled}),
}));
