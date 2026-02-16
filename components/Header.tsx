import Link from 'next/link';
import { Pill, User } from 'lucide-react';

interface HeaderProps {
  currentUser?: {
    name: string;
    role: string;
  };
}

export default function Header({ currentUser }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Pill className="w-8 h-8 text-primary-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Drug Development</h1>
              <p className="text-xs text-gray-500">Portfolio Dashboard</p>
            </div>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
              Programs
            </Link>
            {currentUser && (
              <div className="flex items-center space-x-2 pl-6 border-l border-gray-200">
                <User className="w-5 h-5 text-gray-400" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{currentUser.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
                </div>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
