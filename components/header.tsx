
import Link from "next/link";
import { BookHeart } from 'lucide-react';
// bg-background/95
export default function Header() {
    return (
        <div className="w-full fixed top-0 z-50  backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="absolute inset-0 border-b border-primary/10" />
            <header className="relative max-w-full mx-auto px-4 bg-amber-500 flex justify-between h-20 ">

                {/* Left: Logo */}
                
                <Link
                    href="/"
                    className="flex gap-x-2 text-[23px] items-center p-0 m-0 bg-blue-500"
                >
                    
                    <BookHeart size={40} />
                    Emora-Ai
                   
              
                </Link>
                
                {/* Right: Placeholder for buttons */}
                <div className="flex items-center space-x-4 p-2 bg-amber-900">
                    {/* Guest Access, Login, Signup buttons will go here */}
                   <p className="bg-blue-500">nodnv</p> 
                   <p className="bg-blue-500">nodnv</p> 
                   <p className="bg-blue-500">nodnv</p> 
                   
                </div>
            </header>
        </div>
    );
}