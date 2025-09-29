'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { PiSignOutDuotone, PiHouseDuotone } from 'react-icons/pi';
import { paths } from '@/lib/constants';
import { Button } from '@/components/ui';
import { TextLogo } from '@/components/ui/text-logo';
import { SignOut } from '@/lib/utils/auth-helpers/server';
import { handleRequest } from '@/lib/utils/auth-helpers/client';
import { getRedirectMethod } from '@/lib/utils/auth-helpers/settings';
import { ProfileIcon } from '@/components/ui/icons';

interface NavLinksProps {
  user?: User | null;
}

// Dropdown component that renders outside the navbar
const DropdownPortal = ({ 
  isOpen, 
  onClose, 
  buttonRef, 
  isSigningOut, 
  onLogout
}: {
  isOpen: boolean;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
  isSigningOut: boolean;
  onLogout: (e: React.FormEvent<HTMLFormElement>) => void;
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: rect.right - 192, // 192px = w-48 (12rem)
      });
    }
  }, [isOpen, buttonRef]);

  const handleLinkClick = (href: string) => {
    // Use setTimeout to ensure the click is processed before closing
    setTimeout(() => {
      onClose();
      window.location.href = href;
    }, 0);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.stopPropagation();
    onLogout(e);
  };

  if (!isOpen || !isMounted) return null;

  return createPortal(
    <div 
      className="fixed w-48 bg-white rounded-xl shadow-lg border border-fg-line overflow-hidden"
      style={{
        top: position.top,
        left: position.left,
        zIndex: 99999,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="py-2">
        <button
          className="flex items-center gap-3 px-4 py-3 text-sm text-fg-text-contrast hover:bg-bg-bg-subtle transition-colors cursor-pointer w-full text-left"
          onClick={(e) => {
            e.stopPropagation();
            handleLinkClick(paths.user.dashboard);
          }}
        >
          <PiHouseDuotone className="w-4 h-4" />
          Dashboard
        </button>
        <button
          className="flex items-center gap-3 px-4 py-3 text-sm text-fg-text-contrast hover:bg-bg-bg-subtle transition-colors cursor-pointer w-full text-left"
          onClick={(e) => {
            e.stopPropagation();
            handleLinkClick('/pricing');
          }}
        >
          <PiHouseDuotone className="w-4 h-4" />
          Pricing
        </button>
        <button
          className="flex items-center gap-3 px-4 py-3 text-sm text-fg-text-contrast hover:bg-bg-bg-subtle transition-colors cursor-pointer w-full text-left"
          onClick={(e) => {
            e.stopPropagation();
            handleLinkClick(paths.home);
          }}
        >
          <PiHouseDuotone className="w-4 h-4" />
          Home Page
        </button>
        <form onSubmit={handleFormSubmit}>
          <input type="hidden" name="pathName" value="/" />
          <button
            type="submit"
            disabled={isSigningOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-alert-text hover:bg-alert-bg-subtle transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <PiSignOutDuotone className="w-4 h-4" />
            {isSigningOut ? 'Signing out...' : 'Logout'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export const NavLinks = ({ user }: NavLinksProps) => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const desktopButtonRef = useRef<HTMLButtonElement>(null);

  const handleLogout = async (e: React.FormEvent<HTMLFormElement>) => {
    if (isSigningOut) return; // Prevent multiple submissions
    
    setIsSigningOut(true);
    try {
      // Use the proper auth helper pattern
      const routerToUse = getRedirectMethod() === 'client' ? router : null;
      await handleRequest(e, SignOut, routerToUse);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsSigningOut(false);
      setIsDropdownOpen(false);
    }
  };

  // Close dropdown when clicking outside (with delay to avoid race conditions)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Check if click is on the buttons
      if (
        (mobileButtonRef.current && mobileButtonRef.current.contains(target)) ||
        (desktopButtonRef.current && desktopButtonRef.current.contains(target))
      ) {
        return; // Don't close when clicking the button
      }
      
      // Close dropdown with a small delay to allow menu items to be clicked
      setTimeout(() => {
        setIsDropdownOpen(false);
      }, 150);
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isDropdownOpen]);

  return (
    <nav className="w-full text-default-fg bg-bg-base border-b border-fg-line">
      <div className={'mx-auto max-w-screen-xl p-3.5 lg:px-6'}>
        <div className="relative flex items-center justify-between">
          <Link
            href={paths.home}
            className="flex items-center flex-1 flex-shrink-0 cursor-pointer"
          >
            <TextLogo className="h-6 w-auto" />
          </Link>

          <div className="flex lg:hidden">
            {user ? (
              /* Profile Dropdown for Mobile */
              <div className="relative" ref={dropdownRef}>
                <button
                  ref={mobileButtonRef}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="focus:outline-none"
                >
                  <ProfileIcon />
                </button>
                <DropdownPortal 
                  isOpen={isDropdownOpen}
                  onClose={() => setIsDropdownOpen(false)}
                  buttonRef={mobileButtonRef}
                  isSigningOut={isSigningOut}
                  onLogout={handleLogout}
                />
              </div>
            ) : (
              <Link href={paths.auth.signin}>
                <Button color="primary" variant="solid" size="medium">
                  Get Started
                </Button>
              </Link>
            )}
          </div>

          <div className="items-center justify-end flex-1 hidden lg:flex">
            {user ? (
              <div className="flex items-center gap-2">
                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                                      <button
                      ref={desktopButtonRef}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="focus:outline-none"
                    >
                      <ProfileIcon />
                    </button>
                    <DropdownPortal 
                      isOpen={isDropdownOpen}
                      onClose={() => setIsDropdownOpen(false)}
                      buttonRef={desktopButtonRef}
                      isSigningOut={isSigningOut}
                      onLogout={handleLogout}
                    />
                </div>
              </div>
            ) : (
              <Link href={paths.auth.signin}>
                <Button color="primary" variant="solid" size="medium">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
