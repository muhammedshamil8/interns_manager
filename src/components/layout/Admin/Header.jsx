import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/assets/icons/connect.png';
import { User } from 'lucide-react';

const Header = () => {
    const authContext = useAuth();
    const { user } = authContext || {};

    return (
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center min-h-20 fixed top-0 z-30 w-full">
            <div className='px-4'>
                {/* <h1 className="text-lg font-semibold">Connect Panel</h1> */}
                <img src={Logo} alt="Connect Logo" className="h-10" />
            </div>
            <input type="text" placeholder="Search blah blah..." className="bg-white hidden md:block text-gray-500 px-4 text-sm rounded-full max-w-[360px] h-10 w-full outline-none ring-0 border border-blue-500" />
            <div className="text-sm flex items-center justify-center gap-2"><User className=''/>
                <div className='flex flex-col leading-3'>
                    <p className='text-sm font-semibold'>{user?.displayName}</p>
                    <p className='text-[12px]'>{user?.email}</p>
                
                </div>
            </div>
        </header>
    );
};

export default Header;
