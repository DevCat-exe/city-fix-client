import { useAuth } from './useAuth';

export function useRole() {
    const { dbUser, loading } = useAuth();

    // If dbUser is available, use its role
    const role = dbUser?.role || 'citizen';
    return { role, loading };
}

export default useRole;
