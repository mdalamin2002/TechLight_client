import { AuthContext } from '@/context/AuthContext/FirebaseContext';
import React, { useContext } from 'react';

const useAuth = () => {
    const authInfo = useContext(AuthContext)
    return authInfo
};

export default useAuth;
