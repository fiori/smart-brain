import { useState, useEffect, useRef } from 'react';
import "./ProfileIcon.css";

const ProfileIcon = ({ onRouteChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const dropdownRef = useRef(null);

  const handleSignOut = () => {
    onRouteChange('signout');
    setDropdownOpen(false); // Close the dropdown after sign out
  };

  useEffect((e) => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  return (
    <div className="pa4 tc" ref={dropdownRef}>
      <div className="relative">
        <img src="https://tachyons.io/components/avatars/circle-border/screenshot.jpg?version=cb0db27a4c651b43cedc9c1a60548a25" className="br-100 ba h3 w3 dib pointer" alt="avatar" onClick={toggle} />
        {dropdownOpen && (
          <div className="absolute right-0 mt2 shadow-5" style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}>
            <button className="db w-100 pa2 white bg-transparent bn nowrap hover-bg-purple" onClick={() => console.log('View Profile')}>
              View Profile
            </button>
            <button className="db w-100 pa2 white bg-transparent bn nowrap hover-bg-purple" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};



export default ProfileIcon;