import { User } from '@/db/dummy';
import {create} from 'zustand';

// define  the state type for the selected user
type SelectedUserState = {
    selectedUser: User | null;
    setSelectedUser: (user: User | null) => void;
}
// create the store for the selected user
export const useSelectedUser = create<SelectedUserState>((set) => ({
    selectedUser: null,
    setSelectedUser: (user:User  | null) => set({selectedUser: user})
}))

